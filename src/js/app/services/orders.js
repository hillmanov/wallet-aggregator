services.factory('orders', function($q, db) {

  var ordersService         = {};
      finishedGettingOrders = false,
      orderIds              = null,
      pageCount             = 0,
      orderCount            = 0,
      today                 = moment().format('YYYY-MM-DD'),
      yesterday             = moment().subtract(1, 'day').format('YYYY-MM-DD'),
      startOfThisWeek       = moment().startOf('week').format('YYYY-MM-DD'),
      endOfLastWeek         = moment().subtract(1, 'week').endOf('week').format('YYYY-MM-DD'),
      startOfLastWeek       = moment().subtract(1, 'week').startOf('week').format('YYYY-MM-DD'),
      startOfThisMonth      = moment().startOf('month').format('YYYY-MM-DD'),
      endOfLastMonth        = moment().subtract(1, 'month').endOf('month').format('YYYY-MM-DD'),
      startOfLastMonth      = moment().subtract(1, 'month').startOf('month').format('YYYY-MM-DD');

  ordersService.init = function(domeNode) {
    return db.init()
             .then(function() {
               return db.executeSql('SELECT id FROM orders', [])
             })
             .then(function(results){
               return orderIds = _.pluck(results,'id');
             });
  };

  ordersService.fetchAndStoreOrders = function(domNode, deferred) {
    deferred.notify({
      type: 'pageCount',
      value: pageCount++
    });

    var orders = _.map($(domNode).find('table tbody tr[id]'), function(row, index) {
      var $row = $(row);
      return {
        id:      $row.attr('id'),
        appName: $row.find('.order-description > div').text().split(/Premium|-/)[0].trim(), // Specific for my apps and their naming schemes
        total:   parseFloat($row.find('.order-total > .money-col > div').text().replace('$', '')),
        status:  $row.find('.status .status-value').first().text(),
        date:    moment(new Date($row.find('.order-date> .desktop-only').text())).format('YYYY-MM-DD')
      }
    });

    return $q.all(
                  _(orders)
                  .map(function(order) {
                    if (order.date < startOfLastMonth || _.contains(orderIds, order.id)) {
                      finishedGettingOrders = true;
                      return false;
                    } else {
                      deferred.notify({
                        type: 'orderCount',
                        value: orderCount++
                      });
                      return db.executeSql('INSERT INTO orders(id, appName, total, status, date) VALUES (?, ?, ?, ?, ?)', [order.id, order.appName, order.total, order.status, order.date]);
                    }
                  })
                  .compact()
                  .value()
                )
                .then(function(results) {
                  if (finishedGettingOrders) {
                    return deferred.resolve();
                  } else {
                    var nextLink = $(domNode).find('a.next-page').first().attr('href');
                    $.get(nextLink, function(html) {
                      return ordersService.fetchAndStoreOrders($(html).find('.orders'), deferred);
                    });
                  }
                });
  };

  ordersService.getOrderBreakdown = function(domNode) {
    return ordersService.init()
             .then(function() {
               var deferred = $q.defer();
               ordersService.fetchAndStoreOrders(domNode, deferred);
               return deferred.promise;
             })
             .then(function() {
               return $q.all([
                 db.executeSql('SELECT appName, SUM(total) as total, COUNT(*) as count FROM orders WHERE status IN ("Charged", "Chargeable") AND date = ? GROUP BY appName', [today]),
                 db.executeSql('SELECT appName, SUM(total) as total, COUNT(*) as count FROM orders WHERE status IN ("Charged", "Chargeable") AND date = ? GROUP BY appName', [yesterday]),
                 db.executeSql('SELECT appName, SUM(total) as total, COUNT(*) as count FROM orders WHERE status IN ("Charged", "Chargeable") AND date BETWEEN ? AND ? GROUP BY appName', [startOfThisWeek, today]),
                 db.executeSql('SELECT appName, SUM(total) as total, COUNT(*) as count FROM orders WHERE status IN ("Charged", "Chargeable") AND date BETWEEN ? AND ? GROUP BY appName', [startOfLastWeek, endOfLastWeek]),
                 db.executeSql('SELECT appName, SUM(total) as total, COUNT(*) as count FROM orders WHERE status IN ("Charged", "Chargeable") AND date BETWEEN ? AND ? GROUP BY appName', [startOfThisMonth, today]),
                 db.executeSql('SELECT appName, SUM(total) as total, COUNT(*) as count FROM orders WHERE status IN ("Charged", "Chargeable") AND date BETWEEN ? AND ? GROUP BY appName', [startOfLastMonth, endOfLastMonth])
               ])
             })
             .then(function(results) {
               return {
                 today:     { apps: results[0], aggregate: getAggregate(results[0]) },
                 yesterday: { apps: results[1], aggregate: getAggregate(results[1]) },
                 thisWeek:  { apps: results[2], aggregate: getAggregate(results[2]) },
                 lastWeek:  { apps: results[3], aggregate: getAggregate(results[3]) },
                 thisMonth: { apps: results[4], aggregate: getAggregate(results[4]) },
                 lastMonth: { apps: results[5], aggregate: getAggregate(results[5]) },
               }
             });
  };

  function getAggregate(results) {
    return _.reduce(results, function(aggregate, appResult) {
      aggregate.total = aggregate.total + appResult.total;
      aggregate.count = aggregate.count + appResult.count;
      return aggregate;
    }, { total: 0, count: 0 });
  }

  return ordersService;
});

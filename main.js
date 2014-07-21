function WalletAggregatorCtrl($scope) {
  var nextLink;

  function parseData(node) {
    var orders = $(node).find('.orderRow').map(function(index, row) {
      return {
          date:        $(row).find('.wallet-date-column > div').text(),
          status:      $(row).find('.wallet-status-column > img').attr('title'),
          nameOfApp:   $(row).find('.wallet-description-column-shifted > div').text().split("(")[0].trim().replace(/premium/i, ''),
          total:       parseFloat($(row).find('.wallet-total-column > div').text().replace('$', ''))
        }
      });
    
    nextLink = $(node).find('#purchaseOrderPager-pagerNextButton').attr('href');

    $scope.dashboardData = _(orders)
                            .groupBy('date')
                            .map(function(transactions, date) {
                              transactions = _.filter(transactions, function(transaction) {
                                return transaction.status != 'Canceled'
                                       && 
                                       (transaction.nameOfApp.indexOf('Test') == -1);
                              });

                              return {
                                date: date,
                                details: _(transactions)
                                          .groupBy('nameOfApp')
                                          .map(function(transactionsForApp, nameOfApp) {
                                            return {
                                              nameOfApp: nameOfApp,
                                              transactions: transactionsForApp,
                                              total: _.reduce(transactionsForApp, function(sum, transaction) {
                                                return sum + transaction.total
                                              }, 0)
                                            }
                                          })
                                          .value(),
                                total: _.reduce(transactions, function(sum, transaction) {
                                  return sum + transaction.total
                                }, 0)
                              }
                            })
                            .sort(function(item1, item2) {
                              return moment(item2.date) - moment(item1.date);
                            })
                            .value();
  }
   parseData($('.container'));
   $.get(nextLink, function(html) {
      console.log($(html).find('.container'));
      console.log(parseData($(html).find('.container')));
      console.log($scope.dashboardData);
    });
};

$(document).ready(function() {
  $.get(chrome.extension.getURL('templates/list.html'), function(text) {
    $('.kd-content-sidebar').append(text);
    angular.bootstrap($("#wa-dashboard"));
  });
});


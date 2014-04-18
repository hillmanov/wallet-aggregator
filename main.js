function WalletAggregatorCtrl($scope) {

  function parseData(node) {
    var orders = $(node).find('.orderRow').map(function(index, row) {
      return {
          date:        $(row).find('.wallet-date-column > div').text(),
          status:      $(row).find('.wallet-status-column > img').attr('title'),
          description: $(row).find('.wallet-description-column-shifted > div').text().split("(")[0].trim(),
          total:       parseFloat($(row).find('.wallet-total-column > div').text().replace('$', ''))
        }
      });

    $scope.dashboardData = _(orders)
                            .groupBy('date')
                            .map(function(transactions, date) {
                              transactions = _.filter(transactions, function(transaction) {
                                return transaction.status != 'cancelled';
                              });

                              return {
                                date: date,
                                details: _(transactions)
                                          .groupBy('description')
                                          .map(function(transactionsForApp, description) {
                                            return {
                                              description: description,
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
   parseData($('body'));
};

$(document).ready(function() {
  var dashboard =  $('<div id="wa-dashboard" ng-app="" ng-csp="" ng-controller="WalletAggregatorCtrl"><ul><li ng-repeat="item in dashboardData">{{item.date}}</li></div>');
  $('.kd-content-sidebar').append(dashboard);
  angular.bootstrap($("#wa-dashboard"));
});
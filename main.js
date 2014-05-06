function WalletAggregatorCtrl($scope) {

  function parseData(node) {
    var orders = $(node).find('.orderRow').map(function(index, row) {
      return {
          date:        $(row).find('.wallet-date-column > div').text(),
          status:      $(row).find('.wallet-status-column > img').attr('title'),
          nameOfApp:   $(row).find('.wallet-description-column-shifted > div').text().split("(")[0].trim(),
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
   parseData($('body'));
   console.log($scope.dashboardData);
};

$(document).ready(function() {
  $.get(chrome.extension.getURL('templates/list.html'), function(text) {
    $('.kd-content-sidebar').append(text);
    angular.bootstrap($("#wa-dashboard"));
  });
});
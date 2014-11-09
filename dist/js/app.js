var services    = angular.module('walletAggregator.services', []),
    controllers = angular.module('walletAggregator.controllers', []),
    directives  = angular.module('walletAggregator.directives', []),
    filters     = angular.module('walletAggregator.filters', []),
    app         = angular.module('walletAggregator', ['walletAggregator.services', 'walletAggregator.controllers','walletAggregator.directives', 'walletAggregator.filters']);

$(document).ready(function() {
  $.get(chrome.extension.getURL('templates/list.html'), function(text) {
    $('.kd-content-sidebar').append(text);
    angular.bootstrap($('#wa-dashboard', ['walletAggregator']));
  });
});

controllers.controller('MainCtrl', ["purchaseHistoryService", function(purchaseHistoryService) {


}]);

services.factory('currencyConversionFetcher', function() {
  var currencyConversionFetcher;


  return currencyConversionFetcher;
});


services.factory('currencyConverter', ["currencyConversionFetcher", function(currencyConversionFetcher) {
  var currencyConverter;


  return currencyConverter;
}]);

services.factory('purchaseHistoryCalculator', ["currencyConverter", function(currencyConverter) {
  var purchaseHistoryCalculator;


  return purchaseHistoryCalculator;
}]);


services.factory('purchaseHistoryFetcher', ["$q", function($q) {
  var purchaseHistoryFetcher = {};


  purchaseHistoryFetcher.fetchCurrentMonth = function() {

  };

  purchaseHistoryFetcher.fetchLastMonth = function() {

  };


  purchaseHistoryFetcher.fetchRange = function(startDate, endData) {
    var deferred = $q.defer();

  };

  return purchaseHistoryFetcher;
}]);


services.factory('purchaseHistory', ["$q", function($q) {
  var purchaseHistory = {};
}]);


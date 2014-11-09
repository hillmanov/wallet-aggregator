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

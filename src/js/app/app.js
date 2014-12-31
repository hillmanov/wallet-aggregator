var services    = angular.module('walletAggregator.services', []),
    controllers = angular.module('walletAggregator.controllers', []),
    directives  = angular.module('walletAggregator.directives', []),
    filters     = angular.module('walletAggregator.filters', []),
    app         = angular.module('walletAggregator', ['walletAggregator.services', 'walletAggregator.controllers','walletAggregator.directives', 'walletAggregator.filters']);

$(document).ready(function() {
  $.get(chrome.extension.getURL('templates/root.html'), function(html) {
    $('#navigation').append(html);
    angular.bootstrap($(".main-page"), ['walletAggregator']);
  });
});

app.directive('breakdown', function() {
  return {
    restrict: 'E',
    scope: {
      bundle: '=',
      multiplier: '=',
      title: '@'
    },
    templateUrl: 'templates/breakdown.html',
    link: _.noop
  };
});

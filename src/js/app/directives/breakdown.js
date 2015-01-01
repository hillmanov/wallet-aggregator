app.directive('breakdown', function() {
  return {
    restrict: 'E',
    scope: {
      bundle: '=',
      title: '@'
    },
    templateUrl: 'templates/breakdown.html',
    link: function(scope, element, attrs) {

      console.log(scope.bundle);

    }
  };
});

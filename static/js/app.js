var app = angular.module('mg', []);

app.config(function($interpolateProvider) {
  $interpolateProvider.startSymbol('_{');
  $interpolateProvider.endSymbol('}_');
});

app.controller('mgCourses', ['$scope', function rmSMSCtrl($scope) {

  $scope.followed_only = true;

  $scope.courses = function() {
    return $.grep($scope._courses || [], function(c) {
      // filters
      if ($scope.followed_only) { return c.followed; }

      return true;
    });
  };

  // init
  $(function() {
    $scope._courses = JSON.parse($('#courses-json').remove().html());
    $scope.$apply();
  });

}]);

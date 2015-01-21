var app = angular.module('mg', ['ui.bootstrap']);

app.config(function($interpolateProvider) {
  $interpolateProvider.startSymbol('_{');
  $interpolateProvider.endSymbol('}_');
});

app.controller('mgCourses', ['$scope', function rmSMSCtrl($scope) {

  // init
  $(function() {
    $scope.courses = JSON.parse($('#courses-json').remove().html());
    $scope.$apply();
  });

}]);

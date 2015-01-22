var app = angular.module('mg', []);

app.config(function($interpolateProvider) {
  $interpolateProvider.startSymbol('_{');
  $interpolateProvider.endSymbol('}_');
});

app.controller('mgCourses', ['$scope', function rmSMSCtrl($scope) {

  _scope = $scope; // debug

  $.extend(true, $scope, {
    fields: [
      {
        'id': 'code',
        'label': 'Code',
      },
      {
        'id': 'title',
        'label': 'title',
      },
      {
        'id': 'semester',
        'label': 'Semestre',
      },
      {
        'id': 'status',
        'label': 'Statut',
      },
      {
        'id': 'ects',
        'label': 'ECTS',
      },
      {
        'id': 'followed',
        'label': 'Suivi ?',
        'fmt': function(v) {
          return v ? "oui" : "non";
        }
      },
      {
        'id': 'result',
        'label': 'Note',
        'fmt': function(v, c) { return c.session ? ("" + v + "/20") : "";  }
      },
      {
        'id': 'jury',
        'label': 'Note Jury',
        'fmt': function(v, c) { return c.jury > 0 ? ("" + v + "/20") : "";  }
      },
      {
        'id': 'session',
        'label': 'Session',
      },
    ],

    // filters
    followed_only: true,

    // late initialization
    _courses: [],
    available_fields: {},
  });

  $scope.followed_only = true;

  $scope.courses = function() {
    return $.grep($scope._courses, function(c) {
      // filters
      if ($scope.followed_only) { return c.followed; }

      return true;
    });
  };

  $scope.setCourses = function(cs) {
    $scope._courses = cs || [];

    if ($scope._courses.length) {
      $.each(cs[0], function(k, v) {
        $scope.available_fields[k] = true;
      });
    }
  };

  // filter
  $scope.displayedField = function(field) {
    return $scope.available_fields.hasOwnProperty(field.id);
  };

  // format
  $scope.fmtField = function(fn, value, course) {
    return fn ? fn(value, course) : value;
  };

  // init
  $(function() {
    $scope.setCourses(JSON.parse($('#courses-json').remove().html()));
    $scope.$apply();
  });

}]);

var app = angular.module('mg', []);

app.config(function($interpolateProvider) {
  $interpolateProvider.startSymbol('_{');
  $interpolateProvider.endSymbol('}_');
});

app.controller('mgCourses', ['$scope', function rmSMSCtrl($scope) {

  _scope = $scope; // debug

  function fmtResult(v) {
    return sprintf("%05.2f/20", +v);
  }

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
        'fmt': function(v, c) { return c.session ? fmtResult(v) : "";  }
      },
      {
        'id': 'jury',
        'label': 'Note Jury',
        'fmt': function(v, c) { return c.jury > 0 ? fmtResult(v) : "";  }
      },
      {
        'id': 'session',
        'label': 'Session',
      },
    ],

    // filters
    followed_only: true,

    follow_all_courses: false,

    // late initialization
    _courses: [],
    available_fields: {},
  });

  $scope.courses = function() {
    return $.grep($scope._courses, function(c) {
      // filters
      if ($scope.followed_only) { return c.followed; }

      return true;
    });
  };

  $scope.setCourses = function(cs) {
    $scope._courses = cs || [];

    var l = $scope._courses.length;

    if (l) {
      $.each(cs[0], function(k, v) {
        $scope.available_fields[k] = true;
      });
    }

    // set 'follow_all_courses'

    if (!($scope.follow_all_courses = l > 0)) {
      return;
    }
    for (var i=0; i<l; i++) {
      if (!$scope._courses[i].followed) {
        $scope.follow_all_courses = false;
        break;
      }
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

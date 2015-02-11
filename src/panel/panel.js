angular.module('ngui.panel', ['ngui.utils', 'ngui.collapse', 'ngui.fullscreen', 'ngui.if'])
  .directive('nguiPanelHeader', ['utils', function(utils) {
    return {
      templateUrl: 'template/panel/header.html',
      scope: false,
      replace: true,
      transclude: true,
      controller: function($scope) {
        $scope.defaultHeaderActions = {
          fullscreen: {

          },
          collapse: {
            collapsed: false,
            template: ''
          }
        }
      },
      link: function($scope, $element, $attrs) {

      }
    };
  }])
  .directive('nguiPanel', ['utils', function(utils) {
    return {
      restrict: 'EA',
      templateUrl: 'template/panel/panel.html',
      scope: {
        title: '@nguiPanel'
      },
      replace: true,
      transclude: true,
      link: function($scope, $element, $attrs) {

      }
    };
  }]);

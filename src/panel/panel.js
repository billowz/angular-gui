"use strict"
angular.module('ngui.panel', ['ngui.utils', 'ngui.transclude','ngui.collapse', 'ngui.fullscreen', 'ngui.if'])
  .directive('nguiPanel', ['utils', function(utils) {
    return {
      restrict: 'EA',
      templateUrl: 'template/panel/panel.html',
      scope: {
        title: '@nguiPanel',
        collapseable: '@',
        fullscreenable: '@'
      },
      replace: true,
      transclude: true
    };
  }])
  .directive('nguiPanelAction', ['utils', function(utils) {
    return {
      restrict: 'A',
      templateUrl: 'template/panel/action.html',
      scope: false,
      replace: true,
      transclude: false
    };
  }]);

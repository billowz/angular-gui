"use strict"
angular.module('ngui.panel', ['ngui.utils', 'ngui.transclude','ngui.collapse', 'ngui.fullscreen', 'ngui.if'])
  .directive('nguiPanel', ['utils', function(utils) {
    return {
      restrict: 'EA',
      templateUrl: 'template/panel/panel.html',
      scope: {
        title: '@nguiPanel'
      },
      replace: true,
      transclude: true,
      controller: function() {
        //Empty controller so other directives can require being 'under' a tab
      },
      link: function($scope, $element, $attrs) {

      }
    };
  }]);

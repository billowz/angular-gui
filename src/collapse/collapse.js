"use strict"
angular.module('ngui.collapse', ['ui.bootstrap.transition', 'ngui.utils'])
  .directive('nguiCollapse', ['$transition', 'utils', function($transition, utils) {
    return {
      link: function(scope, element, attrs) {

        var transition = utils.createTransition();

        function expand() {
          element.removeClass('collapse').addClass('collapsing');
          transition.doTransition(element, {
            height: element[0].scrollHeight + 'px'
          }).then(expandDone);
        }

        function expandDone() {
          element.removeClass('collapsing');
          element.addClass('collapse in');
          element.css({
            height: 'auto'
          });
        }

        function collapse() {
          // CSS transitions don't work with height: auto, so we have to manually change the height to a specific value
          element.css({
            height: element[0].scrollHeight + 'px'
          });
          //trigger reflow so a browser realizes that height was updated from auto to a specific value
          var x = element[0].offsetWidth;

          element.removeClass('collapse in').addClass('collapsing');

          transition.doTransition(element, {
            height: attrs.nguiCollapseHeight || 0
          }).then(collapseDone);
        }

        function collapseDone() {
          element.removeClass('collapsing');
          element.addClass(attrs.nguiCollapseHeight > 0 ? 'ngui-collapse' : 'collapse');
        }
        utils.defaultVal(scope, attrs.nguiCollapse, attrs[attrs.nguiCollapse] === 'true');
        scope['is_' + attrs.nguiCollapse] = function() {
          return scope[attrs.nguiCollapse];
        }
        scope['toggle_' + attrs.nguiCollapse] = function() {
          scope[attrs.nguiCollapse] = !scope[attrs.nguiCollapse];
        }
        return scope.$watch(attrs.nguiCollapse, function(val, nval) {
          if (!!val === !!nval) {
            return;
          }
          if (val) {
            collapse();
          } else {
            expand();
          }
        });
      }
    };
  }]);

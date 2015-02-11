angular.module('ngui.collapse', ['ui.bootstrap.transition', 'ngui.utils'])
.directive('nguiCollapse', ['$transition', 'utils', function ($transition, utils) {
  return {
    link: function (scope, element, attrs) {

      var initialAnimSkip = true;
      var currentTransition;
      function doTransition(change) {
        var newTransition = $transition(element, change);
        if (currentTransition) {
          currentTransition.cancel();
        }
        currentTransition = newTransition;
        newTransition.then(newTransitionDone, newTransitionDone);
        return newTransition;

        function newTransitionDone() {
          // Make sure it's this transition, otherwise, leave it alone.
          if (currentTransition === newTransition) {
            currentTransition = undefined;
          }
        }
      }

      function expand() {
        if (initialAnimSkip) {
          initialAnimSkip = false;
          expandDone();
        } else {
          element.removeClass('collapse').addClass('collapsing');
          doTransition({ height: element[0].scrollHeight + 'px' }).then(expandDone);
        }
      }

      function expandDone() {
        element.removeClass('collapsing');
        element.addClass('collapse in');
        element.css({height: 'auto'});
      }

      function collapse() {
        if (initialAnimSkip) {
          initialAnimSkip = false;
          collapseDone();
          element.css({height: attrs.nguiCollapseHeight || 0});
        } else {
          // CSS transitions don't work with height: auto, so we have to manually change the height to a specific value
          element.css({ height: element[0].scrollHeight + 'px' });
          //trigger reflow so a browser realizes that height was updated from auto to a specific value
          var x = element[0].offsetWidth;

          element.removeClass('collapse in').addClass('collapsing');

          doTransition({ height: attrs.nguiCollapseHeight || 0 }).then(collapseDone);
        }
      }

      function collapseDone() {
        element.removeClass('collapsing');
        element.addClass(attrs.nguiCollapseHeight>0 ? 'ngui-collapse':'collapse');
      }
      utils.defaultVal(scope, attrs.nguiCollapse, attrs[attrs.nguiCollapse] === 'true');
      scope.$watch(attrs.nguiCollapse, function (shouldCollapse) {
        if (shouldCollapse) {
          collapse();
        } else {
          expand();
        }
      });
      scope['is_' + attrs.nguiCollapse] = function(){
      	return scope[attrs.nguiCollapse];
      }
      scope['toggle_' + attrs.nguiCollapse] = function(){
      	scope[attrs.nguiCollapse] = !scope[attrs.nguiCollapse];
      }
    }
  };
}]);

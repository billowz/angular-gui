angular.module('ngui.fullscreen', ['ngui.utils'])
  .directive('nguiFullscreen', ['utils', '$window', function(utils, $window) {
    return {
      restrict: 'A',
      link: function($scope, $element, $attrs) {
        var transition = utils.createTransition();

        function resize() {
          if ($scope[$attrs.nguiFullscreen]) {
            $element.css({
              width: angular.element($window).width(),
              height: angular.element($window).height()
            });
            $element.offset({
              left: 0,
              top: 0
            });
          }
        }

        function offResize() {
          angular.element($window).off('resize', resize);
        }

        function bindResizeEvent() {
          angular.element($window).on('resize', resize);
          $element.on('$destroy', offResize);
        }

        function unbindResizeEvent() {
          $element.off('$destroy', offResize);
          offResize();
        }

        function fullscreen(call) {
          $element.addClass('fullscreen fullscreening').css('position', 'absolute');
          offset = $element.offset();
          transition.doTransition($element, {
            width: angular.element($window).width(),
            height: angular.element($window).height(),
            left: -offset.left,
            top: -offset.top
          }).then(function() {
            resize();
            $element.removeClass('fullscreening');
            if (call) {
              call();
            }
          });
          bindResizeEvent();
        }


        function unfullscreen(call) {
          unbindResizeEvent();
          $element.addClass('fullscreening');
          transition.doTransition($element, {
            width: '',
            height: '',
            top: '',
            left: ''
          }).then(function() {
            $element.css('position', '').removeClass('fullscreen').removeClass('fullscreening');
            if (call) {
              call();
            }
          });
        }

        var scrolloverflows = [];
        function setScrolloverflows() {
          angular.forEach($element.parents(), function(elem) {
            elem = angular.element(elem);
            if (elem.css('overflow') === 'scroll' || elem.css('overflow') === 'auto') {
              scrolloverflows.push({overflow:elem.css('overflow'), el:elem});
              elem.css('overflow', 'visible');
            }
          });
        }

        function resetScrolloverflows() {
          if (scrolloverflows.length > 0) {
            angular.forEach(scrolloverflows, function(elem) {
              elem.el.css('overflow', elem.overflow);
            });
            scrolloverflows = [];
          }
        }
        return $scope.$watch($attrs.nguiFullscreen, function(val, nval) {
          if (!!val === !!nval) {
            return;
          }
          if (val) {
            setScrolloverflows();
            fullscreen();
          } else {
            unfullscreen(resetScrolloverflows);

          }
        });
      }
    }
  }]);

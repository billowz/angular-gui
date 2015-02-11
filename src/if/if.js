angular.module('ngui.if', [])
  .directive('nguiIf', ['$animate', function($animate) {
    return {
      multiElement: true,
      transclude: 'element',
      priority: 600,
      terminal: true,
      restrict: 'A',
      $$tlb: true,
      link: function($scope, $element, $attr, ctrl, $transclude) {
        var inited = false;
        $scope.$watch($attr.nguiIf, function nguiIfWatchAction(value) {
          if (!inited && value) {
            $transclude(function(clone, newScope) {
              inited = true;
              clone[clone.length++] = document.createComment(' end ngui.If: ' + $attr.nguiIf + ' ');
              $animate.enter(clone, $element.parent(), $element);
            });
          }
        });
      }
    };
  }])

"use strict"
angular.module('ngui.process', ['ngui.service'])
  .directive('nguiProcess', ['$animate', 'processService', function($animate, processService) {
    return {
      restrict: 'EA',
      scope: false,
      replace: true,
      templateUrl: 'template/process/process.html',
      link: function($scope, $element, $attr) {
        var probar = $element.find('.progress-bar');
        var text = probar.find('.sr-only');
        var processing = false;

        function reset() {
          var nextTask = processService.getCurrentTask();
          if (nextTask) {
            process(nextTask);
          } else {
            probar.width('0%');
            text.text('0%');
          }
          processing = false;
        }

        var currentProcess = 0;
        var currentAnimation;

        function an(target, step, idx, count, timeout, callback) {
          console.log('->',currentProcess, step, idx);
          currentProcess = currentProcess + step;
          if(idx >= count && currentProcess<target){
            currentProcess = target;
          }
          probar.width(currentProcess + '%');
          text.text(currentProcess + '%');
          if (idx < count) {
            currentAnimation = setTimeout(function() {
              currentAnimation = null;
              an(target, step, idx+1, count, timeout, callback);
            }, timeout);
          } else {
            callback();
          }
        }

        function animation(task, callback) {
          if (currentAnimation) {
            clearTimeout(currentAnimation);
          }
          if (currentProcess >= task.process) {
            callback();
          } else {
            var step = task.process - currentProcess,
              count = 0;
            if (step > 3) {
              count = parseInt(step / 3);
              step = step / count;
            }
            an(task.process, step, 0, count, 30/count, callback);
          }
        }

        function process(task) {
          processing = true;
          $element.show();
          animation(task, function() {
            if (task.status !== 'running') {
              probar.addClass(task.status);
              setTimeout(function() {
                var ntask;
                $element.hide();
                probar.removeClass(task.status);
                probar.width('0%');
                text.text('0%');
                currentProcess = 0;
                ntask = processService.getCurrentTask();
                if (ntask) {
                  process(ntask);
                } else {
                  processing = false;
                }
              }, 50);
            } else {
              processing = false;
            }
          });
        }
        processService.listen(function(task) {
          if (!processing) {
            process(task);
            console.log(task);
          }
        });
      }
    };
  }]);

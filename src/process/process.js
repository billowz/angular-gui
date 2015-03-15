"use strict"
angular.module('ngui.process', ['ngui.service'])
  .directive('nguiProcess', ['$animate', 'processService', function($animate, processService) {
    return {
      restrict: 'EA',
      scope: false,
      replace: true,
      templateUrl:'template/process/process.html',
      link: function($scope, $element, $attr) {
        var probar = $element.find('.progress-bar');
        var text = probar.find('.sr-only');
        var processing = false;
        function reset(){
          var nextTask = processService.getCurrentTask();
          if(!nextTask){

          }
          processing = false;
        }

        function process(task){
          processing = true;
          probar.width(task.process+'%');
          text.text(task.process+'%');
          processing = false;
        }
        processService.listen(function(task){
          if(task.status != 'running'){
            processing = true;
            reset();
          }
          if(!processing){
            process(task);
          }
          console.log('process:', task.process, task.status);
        });
      }
    };
  }]);

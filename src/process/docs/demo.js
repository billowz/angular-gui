angular.module('ngui.demo').controller('ProcessCtrl',
 ['processService', '$scope', '$timeout',
  function(processService, $scope, $timeout) {
    function process(timeout, task, i) {
      setTimeout(function() {
        i = i + 10;
        task.setProcess(i);
        if (i < 100) {
          process(timeout, task, i);
        }
      }, timeout);
    }
    process(1000, processService.createProcessTask(), 0);
    process(2000, processService.createProcessTask(), 0);
    process(500, processService.createProcessTask(), 0);
  }
]);

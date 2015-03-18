angular.module('ngui.demo', ['app', 'ngui', 'ui.bootstrap', 'ngAnimate'])
  .run(['$rootScope', 'processService', function($rootScope, processService) {
    $rootScope.$on("$stateChangeStart", function(event, toState, toStateParams, fromState, fromStateParams) {
      processService.abortAll();
      toStateParams.$processTask = processService.createProcessTask();
      console.log(event, toState);
    });
    $rootScope.$on("$stateChangeSuccess", function(event, toState, toStateParams, fromState, fromParams) {
      console.log(event, toState);
      toStateParams.$processTask.complete();
    });

    $rootScope.$on("$stateChangeError", function(event, toState, toStateParams, fromState, fromParams, error) {
      toStateParams.$processTask.error();
      console.log(event);
    });
  }])
  .controller('DemoCtrl', ['$scope', '$window', 'configService', 'menuService',
    function($scope, $window, configService, menuService) {

      $scope.cfg = {};

      configService.listen(function(cfg) {
        angular.extend($scope.cfg, cfg);
      });

      menuService.listen(function(cfg) {
        $scope.cfg.menu = cfg;
      });
    }
  ]);

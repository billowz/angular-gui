angular.module('ngui.demo', ['app', 'ngui', 'ui.bootstrap','ngAnimate'])
  .controller('DemoCtrl', ['$scope', '$window', 'configService', 'menuService',
    function($scope, $window, configService, menuService) {

      $scope.cfg = {} ;

      configService.listen(function(cfg) {
        angular.extend($scope.cfg, cfg);
      });

      menuService.listen(function(cfg) {
        $scope.cfg.menu = cfg;
      });
    }
  ]);

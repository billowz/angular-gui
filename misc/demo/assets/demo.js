angular.module('ngui.demo', ['app', 'ngui', 'ui.bootstrap','ngAnimate'])
  .controller('DemoCtrl', ['$scope', '$window', 'configService', 'menuService',
    function($scope, $window, configService, menuService) {

      $scope.menu = {};
      $scope.cfg = {} ;

      configService.listen(function(cfg) {
        $scope.cfg = cfg;
      });

      menuService.listen(function(cfg) {
        console.log(cfg);
        $scope.menu = cfg;
      });
    }
  ]);

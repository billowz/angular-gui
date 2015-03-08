angular.module('ngui.demo', ['app', 'ngui', 'ui.bootstrap'])
  .controller('DemoCtrl', ['$scope', '$window', 'configService', 'menuService',
    function($scope, $window, configService, menuService) {

      $scope.menu = {};
      $scope.cfg = {};

      configService.getConfig().then(function(cfg) {
        $scope.cfg = cfg;
      });

      menuService.getMenu().then(function(cfg) {
        $scope.menu = cfg;
      });
    }
  ]);

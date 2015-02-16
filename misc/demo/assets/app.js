angular.module('ngui.demo', ['app', 'ngui', 'ui.bootstrap'])
.controller('DemoCtrl', ['$scope', '$window','appService', function ($scope, $window, appService) {


  $scope.menu = {};
  $scope.cfg = {};


  appService.getCfg().then(function(cfg){
    angular.extend($scope.cfg, cfg);
  });

  appService.getMenu().then(function(cfg){
  	$scope.menu = cfg;
  });
}]);



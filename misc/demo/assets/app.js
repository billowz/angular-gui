/**<%= pkg.name%>**/
angular.module('app', ['ngui', 'ui.router'])
  .run(['configService', 'menuService', '$http', function(configService, menuService, $http) {
    configService.syncFunc = function(success, err) {
      $http.get("/assets/cfg.json")
        .success(function(response) {
          success(response)
        });
    }
    menuService.syncFunc = function(success, err) {
      $http.get("/assets/menu.json")
        .success(function(response) {
          success(response)
        });
    }
  }]);

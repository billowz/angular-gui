"use strict"
angular.module('ngui.navigation', ['ngui.utils'])
.constant('nguiNavigationConfig', {
  themes:{
    'horizontal':{
      templateUrl : 'template/navigation/horizontal.html'
    },
    'vertical':{
      templateUrl : 'template/navigation/vertical.html'
    },
    'wheel':{
      templateUrl : 'template/navigation/wheel.html'
    }
  },
  getTheme: function(name){
    return this.themes[name];
  }
})
  .directive('nguiNavigation', ['$animate', '$templateCache', '$compile', 'nguiNavigationConfig',
    function($animate, $templateCache, $compile, navigationConfig) {
    return {
      restrict: 'EA',
      replace: true,
      transclude: true,
      template: '<div class="navigation"></div>',
      link: function($scope, $element, $attr, ctrl, $transclude) {
        $scope.getTitle = function(){
          if($attr.title){
            return $scope.$eval($attr.title) || $attr.title;
          }
          return null;
        }
        $scope.getTheme = function(){
          if($attr.nguiNavigation){
            return $scope.$eval($attr.nguiNavigation) || $attr.nguiNavigation;
          }
          return null;
        }
        $scope.getMenu = function(){
           if($attr.menu){
            return $scope.$eval($attr.menu);
          }
          return null;
        }
        $scope.$watch($scope.getTheme, function(themeName){
          var theme = navigationConfig.getTheme(themeName);
          if(theme){
            $element.html('');
            $element.html($templateCache.get(theme.templateUrl));
            $compile($element.contents())($scope);
          }
        });
      }
    };
  }]);

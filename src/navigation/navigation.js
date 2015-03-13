"use strict"
angular.module('ngui.navigation', ['ngui.dropdown', 'ngui.utils', 'ngui.theme'])
  .config(['themeConfigProvider', function(themeConfigProvider) {
    themeConfigProvider.registerThemeConfig('navigation', null);
    themeConfigProvider.addTheme('navigation', 'theme-horizontal', {
      templateUrl: 'template/navigation/horizontal.html'
    });
    themeConfigProvider.addTheme('navigation', 'theme-vertical', {
      templateUrl: 'template/navigation/vertical.html',
      init: function($element){
        $element.find('.navbar-toggle').on('click', function(event){
          $element.find('.sidebar').toggleClass('hide');
        })
      }
    });
    themeConfigProvider.addTheme('navigation', 'theme-wheel', {
      templateUrl: 'template/navigation/wheel.html'
    });

    var menuNodeTmpl = '<li role="presentation" <%if(!$leaf){%>class="dropdown menu <%=$dropdown_root ? "":"subdropdown"%>"<%}%>>' + '<a role="menuitem"' + '<%if($leaf){%> data-toggle="collapse" data-target=".navbar-collapse" href="<%=href%>" <%if(router){%>ui-sref="<%=router%>"<%}%>' + '<%}else{%> href="javascript:void(0);" class="dropdown-toggle" data-toggle="dropdown"<%}%>' + '><%=text%>' + '</a>' + '</li>';
    themeConfigProvider.addTheme('dropdown', 'theme.menu', {
      menuTmpl: '<ul class="dropdown-menu" role="menu"></ul>',
      nodeTmpl: menuNodeTmpl,
      rootTmpl: menuNodeTmpl,
    });
  }])
  .directive('nguiNavigation', ['$animate', '$templateCache', '$compile', 'themeConfig',
    function($animate, $templateCache, $compile, themeConfig) {
      return {
        restrict: 'EA',
        scope:{},
        replace: true,
        transclude: true,
        template: '<div class="navigation"></div>',
        link: function($scope, $element, $attr, ctrl, $transclude) {
          $scope.getTitle = function() {
            if ($attr.title) {
              return $scope.$parent.$eval($attr.title) || $attr.title;
            }
            return null;
          }
          $scope.getTheme = function() {
            if ($attr.nguiNavigation) {
              return $scope.$parent.$eval($attr.nguiNavigation) || $attr.nguiNavigation;
            }
            return null;
          }
          $scope.supportThemes = themeConfig.getThemes('navigation');
          $scope.getMenu = function() {
            if ($attr.menu) {
              return $scope.$parent.$eval($attr.menu);
            }
            return null;
          }
          $scope.$watch($scope.getTheme, function(themeName) {
            var theme = themeConfig.getTheme('navigation', themeName);
            if (theme) {
              $element.html('');
              $element.html($templateCache.get(theme.templateUrl));
              $compile($element.contents())($scope);
              if(theme.init){
                theme.init($element, $scope);
              }
            }
          });
        }
      };
    }
  ]);

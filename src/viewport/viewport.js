(function() {
  "use strict"
  angular.module('ngui.viewport', ['ngui.utils', 'ngui.theme', 'ngui.tree', 'ngui.dropdown', 'ngui.service'])
    .constant('nguiViewportConfig', {
      miniWidth: 767,
      themeType: 'viewport',
      defaultTheme: 'theme-topmenu',
      defaultMiniTheme: 'theme-topmenu'
    })
    .config(['themeConfigProvider', 'nguiViewportConfig', function(themeConfigProvider, viewportConfig) {
      themeConfigProvider.registerThemeConfig(viewportConfig.themeType, null);
      themeConfigProvider.addTheme(viewportConfig.themeType, 'theme-topmenu', {
        navTmplUrl: 'template/navigation/horizontal.html',
        init: function($element, navEl) {
          this.onClickLeafHandler = function(){
            navEl.find('.navbar-collapse').collapse('toggle');
          }
          navEl.delegate('.leaf', 'click', this.onClickLeafHandler);
        },
        destroy: function($element, navEl) {
          if(this.onClickLeafHandler)
            navEl.undelegate('.leaf', 'click', this.onClickLeafHandler);
        }
      });
      themeConfigProvider.addTheme(viewportConfig.themeType, 'theme-wheel', {
        navTmplUrl: 'template/navigation/wheel.html',
        wheelCls: 'wheel',
        init: function($element) {
          $element.addClass(this.wheelCls);
        },
        destroy: function($element) {
          $element.removeClass(this.wheelCls);
        }
      });

      var menuNodeTmpl = '<li role="presentation" <%if(!$leaf){%>class="dropdown menu <%=$dropdown_root ? "":"subdropdown"%>"<%}%>>' + '<a role="menuitem"' + '<%if($leaf){%> href="<%=href%>" <%if(router){%>ui-sref="<%=router%>"<%}%>' + '<%}else{%> href="javascript:void(0);" class="dropdown-toggle" data-toggle="dropdown"<%}%>' + '><%=text%>' + '</a>' + '</li>';
      themeConfigProvider.addTheme('dropdown', 'theme.menu', {
        menuTmpl: '<ul class="dropdown-menu" role="menu"></ul>',
        nodeTmpl: menuNodeTmpl,
        rootTmpl: menuNodeTmpl,
      });
    }])
    .directive('nguiViewport', ['$window', '$sce', '$timeout',
      '$templateCache', '$compile', 'themeConfig', 'nguiViewportConfig',
      'configService', 'menuService',
      function($window, $timeout, $sce, $templateCache,
        $compile, themeConfig, viewportConfig, configService, menuService) {
        return {
          restrict: 'EA',
          scope: {
            theme: '@'
          },
          replace: true,
          transclude: true,
          templateUrl: 'template/viewport/viewport.html',
          controller: ['$scope', '$window', function($scope, $window) {
            // mini theme key
            function checkMiniTheme() {
              $scope.miniTheme = angular.element($window).width() <= viewportConfig.miniWidth;
            }
            checkMiniTheme();

            function resize() {
              $scope.$apply(checkMiniTheme);
            }

            angular.element($window).on('resize', resize);
            $scope.$on('$destroy', function() {
              angular.element($window).off('resize', resize);
            });

            configService.listen(function(cfg) {
              $scope.cfg = cfg;
            });

            menuService.listen(function(cfg) {
              $scope.menu = cfg;
            });

            this.getTheme = function(val){
              var theme;
              if (val) {
                val = $scope.$parent.$eval(val) || val;
              }else{
                val = $scope.miniTheme ? viewportConfig.defaultMiniTheme : viewportConfig.defaultTheme;
              }
              theme = themeConfig.getTheme(viewportConfig.themeType, val);
              if(!theme){
                val = $scope.miniTheme ? viewportConfig.defaultMiniTheme : viewportConfig.defaultTheme;
                theme = themeConfig.getTheme(viewportConfig.themeType, val);
              }
              return theme;
            }
          }],
          link: function($scope, $element, $attr, ctrl, $transclude) {
            $scope.$watch('cfg.theme', function(val, oldVal) {
              applyTheme(ctrl.getTheme(val));
            });

            var oldTheme;
            function applyTheme(theme) {
              var navEl = $element.find('.navigation:first');
              if(oldTheme && oldTheme.destroy){
                oldTheme.destroy.apply(oldTheme, [$element, navEl]);
              }
              navEl.html('');
              navEl.html($templateCache.get(theme.navTmplUrl));
              $compile(navEl.contents())($scope);
              if (theme.init) {
                theme.init.apply(theme, [$element, navEl]);
              }
              oldTheme = theme;
            }
            $scope.supportThemes = themeConfig.getThemes('viewport');
          }
        };
      }
    ]);
})();

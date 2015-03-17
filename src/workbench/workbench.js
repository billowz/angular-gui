(function() {
  "use strict"
  angular.module('ngui.workbench', [
      'ngui.utils', 'ngui.theme', 'ngui.tree',
      'ngui.service', 'ngui.process'
    ])
    .constant('nguiWorkbenchConfig', {
      miniWidth: 767,
      themeType: 'workbench',
      defaultTheme: 'theme-navbar',
      defaultMiniTheme: 'theme-navbar'
    })
    .directive('nguiWorkbench', ['$window', '$timeout',
      '$templateCache', '$compile', 'themeConfig', 'nguiWorkbenchConfig',
      'configService', 'menuService',
      function($window, $timeout, $templateCache,
        $compile, themeConfig, workbenchConfig, configService, menuService) {
        return {
          restrict: 'EA',
          scope: {
            theme: '@'
          },
          replace: true,
          transclude: true,
          templateUrl: 'template/workbench/workbench.html',
          controller: ['$scope', '$window', function($scope, $window) {
            // mini theme key
            function checkMiniTheme() {
              $scope.miniTheme = angular.element($window).width() <= workbenchConfig.miniWidth;
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

            this.getTheme = function(val) {
              var theme;
              if (val) {
                val = $scope.$parent.$eval(val) || val;
              } else {
                val = $scope.miniTheme ? workbenchConfig.defaultMiniTheme : workbenchConfig.defaultTheme;
              }
              theme = themeConfig.getTheme(workbenchConfig.themeType, val);
              if (!theme) {
                val = $scope.miniTheme ? workbenchConfig.defaultMiniTheme : workbenchConfig.defaultTheme;
                theme = themeConfig.getTheme(workbenchConfig.themeType, val);
              }
              return theme;
            }
          }],
          link: function($scope, $element, $attr, ctrl, $transclude) {
            $scope.$watch('cfg.theme', function(val, oldVal) {
              applyTheme(ctrl.getTheme(val));
            });

            var currentNavScope;

            function applyTheme(theme) {
              var navScope;
              var currentTheme = $scope.currentTheme;
              if (theme === currentTheme) {
                return;
              }
              var navEl = $element.find('.navigation:first');



              if (currentTheme) {
                if (currentTheme.destroy) {
                  currentTheme.destroy.apply(currentTheme, [$element, navEl, currentNavScope]);
                }
                if (currentTheme.navTmplUrl !== theme.navTmplUrl) {
                  currentNavScope.$destroy();
                  currentNavScope = null;
                  navEl.children().remove();
                } else {
                  navScope = currentNavScope;
                }
              }
              if (!navScope) {
                navScope = $scope.$new();
              }

              if (theme.beforeCompile) {
                theme.beforeCompile.apply(theme, [$element, navEl, navScope]);
              }

              if (!currentTheme || currentTheme.navTmplUrl !== theme.navTmplUrl) {
                navEl.append($templateCache.get(theme.navTmplUrl));
                $compile(navEl.contents())(navScope);
              }
              if (theme.afterCompile) {
                theme.afterCompile.apply(theme, [$element, navEl, navScope]);
              }
              currentNavScope = navScope;
              $scope.currentTheme = theme;
              $scope.supportSkins = theme.skins;
              toggleSkin($scope.cfg.skin);
            }

            function getSkin(val) {
              if ($scope.supportSkins) {
                for (var i = 0; i < $scope.supportSkins.length; i++) {
                  if ($scope.supportSkins[i].name === val) {
                    return $scope.supportSkins[i];
                  }
                }
              }
              return null;
            }

            function toggleSkin(val) {
              if ($scope.currentSkin) {
                destorySkin($scope.currentSkin);
              }
              if ($scope.currentTheme) {
                val = val || $scope.currentTheme.defaultSkin;
                var skin = getSkin(val);
                if (!skin) {
                  val = $scope.currentTheme.defaultSkin;
                  skin = getSkin(val);
                }
                if (skin) {
                  applySkin(skin);
                }
              }
            }
            $scope.$watch('cfg.skin', toggleSkin);

            function applySkin(skin) {
              if (skin.workbenchCls) {
                $element.addClass(skin.workbenchCls);
              }
              $scope.currentSkin = skin;
            }

            function destorySkin(skin) {
              if (skin.workbenchCls) {
                $element.removeClass(skin.workbenchCls);
              }
            }
            $scope.supportThemes = themeConfig.getThemes('workbench');
          }
        };
      }
    ])
    .config(['themeConfigProvider', 'nguiWorkbenchConfig',
      function(themeConfigProvider, workbenchConfig) {
        themeConfigProvider.registerThemeConfig(workbenchConfig.themeType, null);

        // navbar config
        var zTreeNavCfg = {
          skins: [{
            name: 'white',
            label: 'White',
            color: '#FFFFFF'
          }, {
            name: 'block',
            label: 'Block',
            workbenchCls: 'skin-block',
            color: '#222222'
          }],
          defaultSkin: 'block',
          beforeCompile: function($element, navEl, $scope) {
            var _self = this;
            $scope.menuOptions = {
              bindRouter: true,
              singleExpand: true,
              onClickOther: _self.onClickOther,
              data: {
                key: {
                  url: 'href'
                }
              },
              callback: {
                onClick: function(event, id, node) {
                  var zTree = $.fn.zTree.getZTreeObj(id);
                  zTree.expandNode(node, !node.open, node.open, null, true);
                  if ($scope.miniTheme && (!node.children || node.children.length === 0)) {
                    navEl.find('.navbar-collapse').collapse('toggle');
                  }
                  if (!$scope.miniTheme && _self.dropdown && (!node.children || node.children.length === 0)) {
                    zTree.expandAll(false);
                  }
                }
              }
            }
          },
          afterCompile: function($element, navEl) {
            if (this.workbenchCls) {
              $element.addClass(this.workbenchCls);
            }
          },
          destroy: function($element, navEl, $scope) {
            $scope.menuOptions = null;
            if (this.workbenchCls) {
              $element.removeClass(this.workbenchCls);
            }
          }
        }

        themeConfigProvider.addTheme(workbenchConfig.themeType,
          'theme-navbar', angular.extend({
            navTmplUrl: 'template/navigation/horizontal.html',
            label: 'Horizontal',
            dropdown: true,
            onClickOther: function(zTree) {
              zTree.expandAll(false);
            }
          }, zTreeNavCfg));

        // side navbar config
        var sideNavCfg = angular.extend({}, zTreeNavCfg);
        var zTreeAfterCompile = zTreeNavCfg.afterCompile;
        sideNavCfg.afterCompile = function($element, navEl) {
          zTreeAfterCompile.apply(this, arguments);
          this.toggleHandler = function() {
            $element.toggleClass('sideout');
          }
          navEl.find('.navbar-toggle').on('click', this.toggleHandler);
        }

        var zTreeDestroy = zTreeNavCfg.destroy;
        sideNavCfg.destroy = function($element, navEl) {
          zTreeDestroy.apply(this, arguments);
          if (this.toggleHandler) {
            navEl.find('.navbar-toggle').unbind('click', this.toggleHandler);
          }
        }
        themeConfigProvider.addTheme(workbenchConfig.themeType,
          'theme-sidebar', angular.extend({
            navTmplUrl: 'template/navigation/vertical.html',
            label: 'Side Menu',
            workbenchCls: 'side'
          }, sideNavCfg));
        themeConfigProvider.addTheme(workbenchConfig.themeType,
          'theme-sidebar-right', angular.extend({
            navTmplUrl: 'template/navigation/vertical.html',
            label: 'Right Side Menu',
            workbenchCls: 'side sideright'
          }, sideNavCfg));

        // wheel menu config
        themeConfigProvider.addTheme(workbenchConfig.themeType, 'theme-wheel', {
          navTmplUrl: 'template/navigation/wheel.html',
          wheelCls: 'wheel',
          label: 'Wheel Menu',
          afterCompile: function($element) {
            $element.addClass(this.wheelCls);
          },
          destroy: function($element) {
            $element.removeClass(this.wheelCls);
          }
        });
      }
    ]);
})();

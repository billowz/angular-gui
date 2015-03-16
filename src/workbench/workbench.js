(function() {
  "use strict"
  angular.module('ngui.workbench', [
      'ngui.utils', 'ngui.theme', 'ngui.tree', 'ngui.tree',
      'ngui.dropdown', 'ngui.service', 'ngui.process'
    ])
    .constant('nguiWorkbenchConfig', {
      miniWidth: 767,
      themeType: 'workbench',
      defaultTheme: 'theme-topmenu',
      defaultMiniTheme: 'theme-topmenu'
    })
    .config(['themeConfigProvider', 'nguiWorkbenchConfig',
      function(themeConfigProvider, workbenchConfig) {
        themeConfigProvider.registerThemeConfig(workbenchConfig.themeType, null);
        themeConfigProvider.addTheme(workbenchConfig.themeType, 'theme-topmenu', {
          navTmplUrl: 'template/navigation/horizontal.html',
          label: 'Horizontal',
          skins: [{
            name: 'white',
            label: 'White',
            color: '#FFFFFF'
          }, {
            name: 'block',
            label: 'Block',
            cls: 'skin-block',
            color: '#222222'
          }],
          defaultSkin: 'block',
          beforeCompile: function($element, navEl, $scope) {
            var _self = this;
            $scope.menuOptions = {
              data:{
                key:{
                  url:'href'
                }
              },
              callback: {
                onClick: function(event, id, node) {
                  var zTree = $.fn.zTree.getZTreeObj(id);
                  zTree.expandNode(node, !node.open, node.open, null, true);
                  event.preventDefault();
                  event.stopPropagation();
                },
                onExpand: function(event, treeId, treeNode) {
                  _self.curExpandNode = treeNode;
                },
                beforeExpand: _self.beforeExpand.bind(_self)
              }
            }
          },
          beforeExpand: function(treeId, treeNode) {
            var pNode = this.curExpandNode ? this.curExpandNode.getParentNode() : null;
            var treeNodeP = treeNode.parentTId ? treeNode.getParentNode() : null;
            var zTree = $.fn.zTree.getZTreeObj(treeId);
            for (var i = 0, l = !treeNodeP ? 0 : treeNodeP.children.length; i < l; i++) {
              if (treeNode !== treeNodeP.children[i]) {
                zTree.expandNode(treeNodeP.children[i], false);
              }
            }
            while (pNode) {
              if (pNode === treeNode) {
                break;
              }
              pNode = pNode.getParentNode();
            }
            if (!pNode) {
              this.singlePath(zTree, treeNode);
            }

          },
          singlePath: function(zTree, newNode) {
            var curExpandNode = this.curExpandNode;
            if (newNode === curExpandNode) return;

            var rootNodes, tmpRoot, tmpTId, i, j, n;

            if (!curExpandNode) {
              tmpRoot = newNode;
              while (tmpRoot) {
                tmpTId = tmpRoot.tId;
                tmpRoot = tmpRoot.getParentNode();
              }
              rootNodes = zTree.getNodes();
              for (i = 0, j = rootNodes.length; i < j; i++) {
                n = rootNodes[i];
                if (n.tId != tmpTId) {
                  zTree.expandNode(n, false);
                }
              }
            } else if (curExpandNode && curExpandNode.open) {
              if (newNode.parentTId === curExpandNode.parentTId) {
                zTree.expandNode(curExpandNode, false);
              } else {
                var newParents = [];
                while (newNode) {
                  newNode = newNode.getParentNode();
                  if (newNode === curExpandNode) {
                    newParents = null;
                    break;
                  } else if (newNode) {
                    newParents.push(newNode);
                  }
                }
                if (newParents != null) {
                  var oldNode = curExpandNode;
                  var oldParents = [];
                  while (oldNode) {
                    oldNode = oldNode.getParentNode();
                    if (oldNode) {
                      oldParents.push(oldNode);
                    }
                  }
                  if (newParents.length > 0) {
                    zTree.expandNode(oldParents[Math.abs(oldParents.length - newParents.length) - 1], false);
                  } else {
                    zTree.expandNode(oldParents[oldParents.length - 1], false);
                  }
                }
              }
            }
            this.curExpandNode = newNode;
          },
          afterCompile: function($element, navEl, $scope) {
            this.onClickLeafHandler = function() {
              navEl.find('.navbar-collapse').collapse('toggle');
            }
            navEl.delegate('.leaf', 'click', this.onClickLeafHandler);
            this.cleanDropdown = function() {
              if (!$scope.miniTheme) {
                $.fn.zTree.getZTreeObj(navEl.find('.ztree').attr('id')).expandAll(false);
              }
            };
            $(document.body).on('click', this.cleanDropdown);
          },
          destroy: function($element, navEl, $scope) {
            $scope.menuOptions = null;
            if (this.onClickLeafHandler)
              navEl.undelegate('.leaf', 'click', this.onClickLeafHandler);
            if (this.clearDropdown)
              $(document.body).on('click', this.cleanDropdown);
          }
        });
        themeConfigProvider.addTheme(workbenchConfig.themeType, 'theme-topleft', {
          navTmplUrl: 'template/navigation/vertical.html',
          label: 'Side Menu',
          skins: [{
            name: 'white',
            label: 'White',
            color: '#FFFFFF'
          }, {
            name: 'block',
            label: 'Block',
            cls: 'skin-block',
            color: '#222222'
          }],
          defaultSkin: 'block',
          afterCompile: function($element, navEl) {
            $element.addClass('side');
            this.onClickLeafHandler = function() {
              navEl.find('.navbar-collapse').collapse('toggle');
            }
            navEl.delegate('.leaf', 'click', this.onClickLeafHandler);
            navEl.find('.navbar-toggle').on('click', function() {
              $element.toggleClass('sideout');
            });
          },
          destroy: function($element, navEl) {
            $element.removeClass('side');
            if (this.onClickLeafHandler)
              navEl.undelegate('.leaf', 'click', this.onClickLeafHandler);
          }
        });

        themeConfigProvider.addTheme(workbenchConfig.themeType, 'theme-topright', {
          navTmplUrl: 'template/navigation/vertical.html',
          label: 'Right Side Menu',
          skins: [{
            name: 'white',
            label: 'White',
            color: '#FFFFFF'
          }, {
            name: 'block',
            label: 'Block',
            cls: 'skin-block',
            color: '#222222'
          }],
          defaultSkin: 'block',
          afterCompile: function($element, navEl) {
            $element.addClass('side sideright');
            this.onClickLeafHandler = function() {
              navEl.find('.navbar-collapse').collapse('toggle');
            }
            navEl.delegate('.leaf', 'click', this.onClickLeafHandler);
            navEl.find('.navbar-toggle').on('click', function() {
              $element.toggleClass('sideout');
            });
          },
          destroy: function($element, navEl) {
            $element.removeClass('side sideright');
            if (this.onClickLeafHandler)
              navEl.undelegate('.leaf', 'click', this.onClickLeafHandler);
          }
        });
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

        var menuNodeTmpl = '<li role="presentation" class="<%=$active ? "active" : ""%> <%if(!$leaf){%>dropdown menu <%=$dropdown_root ? "":"subdropdown"%><%}%>"><a role="menuitem"<%if($leaf){%> href="<%=href%>" <%if(router){%>ui-sref="<%=router%>"<%}%><%}else{%> href="javascript:void(0);" class="dropdown-toggle" data-toggle="dropdown"<%}%>><%=text%></a></li>';
        themeConfigProvider.addTheme('dropdown', 'theme.menu', {
          menuTmpl: '<ul class="dropdown-menu" role="menu"></ul>',
          nodeTmpl: menuNodeTmpl,
          rootTmpl: menuNodeTmpl,
        });
      }
    ])
    .directive('nguiWorkbench', ['$window', '$sce', '$timeout',
      '$templateCache', '$compile', 'themeConfig', 'nguiWorkbenchConfig',
      'configService', 'menuService',
      function($window, $timeout, $sce, $templateCache,
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

            function applyTheme(theme) {
              var currentTheme = $scope.currentTheme;
              if (theme === currentTheme) {
                return;
              }
              var navEl = $element.find('.navigation:first');
              if (currentTheme && currentTheme.destroy) {
                currentTheme.destroy.apply(currentTheme, [$element, navEl, $scope]);
              }

              if (theme.beforeCompile) {
                theme.beforeCompile.apply(theme, [$element, navEl, $scope]);
              }
              if (!currentTheme || currentTheme.navTmplUrl !== theme.navTmplUrl) {
                navEl.html('');
                navEl.html($templateCache.get(theme.navTmplUrl));
                $compile(navEl.contents())($scope);
              }
              if (theme.afterCompile) {
                theme.afterCompile.apply(theme, [$element, navEl, $scope]);
              }
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
              if (skin.cls) {
                $element.addClass(skin.cls);
              }
              $scope.currentSkin = skin;
            }

            function destorySkin(skin) {
              if (skin.cls) {
                $element.removeClass(skin.cls);
              }
            }
            $scope.supportThemes = themeConfig.getThemes('workbench');
          }
        };
      }
    ]);
})();

angular.module('ngui.dropdown', ['ngui.tree', 'ngui.utils', 'ngui.theme'])
  .config(['themeConfigProvider', function(themeConfigProvider) {
    themeConfigProvider.registerThemeConfig('dropdown', function(opt) {
      var theme = {};
      theme.menuTmpl = _.template(opt.menuTmpl);
      theme.nodeTmpl = _.template(opt.nodeTmpl);
      theme.rootTmpl = _.template(opt.rootTmpl);
      return theme;
    });

    var defMenuTmpl = '<ul class="dropdown-menu" role="menu"></ul>';
    var defNodeTmpl = '<li role="presentation" class="<%=$active ? "active":""%> <%if(!$leaf){%>dropdown <%=$dropdown_root ? "":"subdropdown"%><%}%>" >' + '<a role="menuitem"' + '<%if($leaf){%> href="<%=href%>" <%if(router){%>ui-sref="<%=router%>"<%}%>' + '<%}else{%> href="javascript:void(0);" class="dropdown-toggle" data-toggle="dropdown"<%}%>' + '><%=text%>' + '</a>' + '</li>';
    var defRootTmpl = '<div><button role="menuitem" class="dropdown-toggle" data-toggle="dropdown"><%=text%></botton></div>';
    themeConfigProvider.addTheme('dropdown', 'default', {
      menuTmpl: defMenuTmpl,
      nodeTmpl: defNodeTmpl,
      rootTmpl: defRootTmpl,
    });
  }])
  .directive('nguiDropdown', ['utils', '$compile', 'TreeNode', 'themeConfig', function(utils, $compile, TreeNode, themeConfig) {
    function initNode(node) {
      node.href = node.href || 'javascript:void(0);';
      node.router = node.router || false;
      node.text = node.text || '';
      node.$el = null;
      node.$dropdown_root = node.$dropdown_root || false;
      node.$active = node.$active || false;
    }

    function parseDropdown(dropdownEl, node, theme, init) {
      initNode(node);
      var nodeEl = $(node.$dropdown_root ? theme.rootTmpl(node) : theme.nodeTmpl(node));
      nodeEl.data('treeNode', node);
      node.$el = nodeEl;
      dropdownEl.append(nodeEl);
      init(node);
      if (!node.isLeaf()) {
        var menuEl = $(theme.menuTmpl(node));
        nodeEl.append(menuEl);
        angular.forEach(node.$children, function(childNode) {
          parseDropdown(menuEl, childNode, theme, init);
        });
      }
    }
    return {
      restrict: 'EA',
      template: '<div class="dropdown"></div>',
      replace: true,
      transclude: true,
      compile: function() {
        return {
          post: function($scope, $elm, $attrs, uiGridCtrl) {
            $scope.getTheme = function() {
              if ($attrs.theme) {
                return $scope.$eval($attrs.theme) || $attrs.theme;
              }
              return null;
            }
            $scope.isRootDisplay = function() {
              if ($attrs.rootDisplay) {
                return $scope.$eval($attrs.rootDisplay) || $attrs.rootDisplay;
              }
              return null;
            }

            $scope.getRoot = function() {
              if ($attrs.nguiDropdown) {
                return $scope.$eval($attrs.nguiDropdown);
              }
              return null;
            }

            function render() {
              var root = $scope.getRoot();
              if (root && root instanceof TreeNode) {
                var menu = $scope.isRootDisplay() ? [root] : root.$children;
                var theme = themeConfig.getTheme('dropdown', $scope.getTheme() || 'default');
                angular.forEach(menu, function(node) {
                  node.$dropdown_root = true;
                  parseDropdown($elm, node, theme, function(node) {
                    var actionEl = node.$el.first('[role=menuitem]');
                    if (node.isLeaf()) {
                      actionEl.on('click', function() {
                        angular.forEach($elm.find('.active[role=presentation]'), function(el){
                              el = $(el);
                              el.removeClass('active');
                              el.data('treeNode').$active = false;
                            });
                        utils.forEach(node.getHierarchy(), function(n) {
                          if (n.$el) {
                            n.$el.addClass('active');
                          }
                          n.$active = true;
                        });
                      });
                    }
                    if (node.handler) {
                      actionEl.on('click', node.handler);
                    }
                  });
                });
                $('.subdropdown [data-toggle=dropdown]').on('click', function(event) {
                  event.preventDefault();
                  event.stopPropagation();
                  $(this).parent().siblings().removeClass('open');
                  $(this).parent().toggleClass('open');
                });
                $compile($elm.children())($scope);
              }
            }
            $scope.$watch($scope.getRoot, function(val, nval) {
              $elm.empty();
              render();
            });
            render();
          }
        };
      }
    };
  }]);

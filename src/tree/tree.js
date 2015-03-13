"use strict"
angular.module('ngui.tree', ['ngui.utils', 'ngui.theme'])
  .factory('TreeNode', ['utils', function(utils) {
    function TreeNode(option, parent, sync, syncFunc, keyParser, leafParser, applyData) {
      if (arguments.length === 1) {
        parent = option.parent;
        sync = option.sync;
        keyParser = option.keyParser;
        leafParser = option.leafParser;
        applyData = option.applyData;
        syncFunc = option.syncFunc;
        option = option.option;
      }
      this.$parent = parent;
      if (angular.isFunction(keyParser)) {
        this.$key = keyParser(this, option);
        if (!angular.isString(this.$key)) {
          throw new Error('TreeNode.$key is not string[' + this.$key + ']')
        }
        if (!this.$key) {
          throw new Error('TreeNode.$key is empty[' + this.$key + ']')
        }
        this.$keyParser = keyParser;
      } else {
        this.$key = option.key;
      }
      if (angular.isFunction(applyData)) {
        applyData(this, option);
        this.$applyData = applyData;
      } else {
        this.$data = option.data;
      }

      this.$sync = !!sync;
      this.$syncFunc = angular.isFunction(syncFunc) ? syncFunc : null;
      this.$loaded = this.$sync ? false : true;
      this.$leafParser = angular.isFunction(leafParser) ? leafParser : null;
      this.$leaf = this.$leafParser ? this.$leafParser(this, option) : this.$loaded ? true : option.leaf;
      this.$children = [];
      this.$childrenMap = {};
      if (option.children) {
        this.addChildren(option.children);
      }
    }

    TreeNode.prototype.getKey = function() {
      return this.$key;
    }
    TreeNode.prototype.getHierarchy = function() {
      var tmp = this,
        rs = [];
      while (tmp) {
        rs.unshift(tmp);
        tmp = tmp.$parent;
      }
      return rs;
    }
    TreeNode.prototype.getChildren = function() {
      var _self = this;
      return utils.deferred(function(def) {
        if (_self.loaded) {
          def.resolve(_self.$children);
        } else {
          _self.syncFunc(def);
        }
      });
    }
    TreeNode.prototype.isLeaf = function() {
      return this.$leaf;
    }
    TreeNode.prototype.addChildren = function() {
      var option, _self = this,
        node, existNode;
      if (arguments.length === 1) {
        option = arguments[0];
      } else if (arguments.length > 1) {
        option = argumrnts;
      } else {
        return;
      }
      if (angular.isArray(option)) {
        angular.forEach(option, function(child) {
          _self.addChildren(child);
        });
      } else if (angular.isObject(option)) {
        node = new TreeNode(option, _self, _self.$sync, _self.$syncFunc, _self.$keyParser, _self.$leafParser, _self.$applyData);
        existNode = _self.$childrenMap[node.$key];
        if (existNode) {
          _self.$children[_self.$children.indexOf(existNode)] = node;
        } else {
          _self.$children.push(node);
        }
        _self.$childrenMap[node.$key] = node;
        _self.$loaded = true;
        _self.$leaf = false;
      }
    }

    TreeNode.prototype.getRoot = function() {
      var root = this;
      while (root.$parent) {
        root = root.$parent;
      }
      return root;
    }
    TreeNode.prototype.isRoot = function() {
      return !this.$parent;
    }
    TreeNode.prototype.findNode = function(path) {
      var node = this,
        _self = this;
      if (angular.isString(path)) {
        path = path.split(/\s*\/\s*/g);
      }
      if (angular.isArray(path) && path.length > 0) {
        var item = utils.trim(path[0]);
        utils.forEach(path, function(item, idx) {
          item = utils.trim(item);
          if (idx === 0 && !item) {
            node = _self.getRoot().findNode(path.slice(1));
            return false;
          } else if (!item) {
            if (idx !== path.length - 1) {
              node = null;
              return false;
            }
          } else {
            node = node.$childrenMap[item];
            if (!node) {
              node = null;
              return false;
            }
          }
        });
      }
      return node;
    }
    return TreeNode;
  }])
  .directive('nguiTree', ['utils', '$compile', 'TreeNode', 'themeConfig', function(utils, $compile, TreeNode, themeConfig) {
    var treeRootKey = '$tree_root',
      themeKey = "tree",
      defaultTheme = 'theme.default'

    function initNode(node) {
      node.href = node.href || 'javascript:void(0);';
      node.router = node.router || false;
      node.text = node.text || '';
      node.$el = null;
      node.expand = node.expand || false;
      node[treeRootKey] = node[treeRootKey] || false;
    }

    function parseTree(dropdownEl, node, theme, handler) {
      initNode(node);
      var nodeEl = $(node[treeRootKey] ? theme.rootTmpl(node) : theme.nodeTmpl(node));
      nodeEl.data('treeNode', node);
      node.$el = nodeEl;
      if (!node.isLeaf()) {
        var menuEl = $(theme.menuTmpl(node));
        nodeEl.append(menuEl);
        angular.forEach(node.$children, function(childNode) {
          parseTree(menuEl, childNode, theme, handler);
        });
      }
      dropdownEl.append(nodeEl);
      handler(node);
    }
    return {
      restrict: 'EA',
      template: '<div class="tree"></div>',
      replace: true,
      transclude: true,
      compile: function() {
        return {
          post: function($scope, $elm, $attrs, uiGridCtrl) {
            var getTheme = function() {
              if ($attrs.theme) {
                return $scope.$eval($attrs.theme) || $attrs.theme;
              }
              return null;
            }
            var isRootDisplay = function() {
              if ($attrs.rootDisplay) {
                return $scope.$eval($attrs.rootDisplay) || $attrs.rootDisplay;
              }
              return null;
            }

            var getRoot = function() {
              if ($attrs.nguiTree) {
                return $scope.$eval($attrs.nguiTree);
              }
              return null;
            }

            function render() {
              var root = getRoot();
              if(root && !(root instanceof TreeNode)){
                root = new TreeNode({option:root,
                  applyData: function(node, option) {
                    angular.extend(node, option);
                  }});
              }
              if (root && root instanceof TreeNode) {
                var menu = isRootDisplay() ? [root] : root.$children;
                var theme = themeConfig.getTheme(themeKey, getTheme() || defaultTheme);
                angular.forEach(menu, function(node) {
                  node[treeRootKey] = true;
                  parseTree($elm, node, theme, function(node) {
                    if (theme.nodeInit) {
                      theme.nodeInit($elm, node);
                    }
                    var actionEl = node.$el.find('[role=menuitem]:first');
                    if (!node.isLeaf()) {
                      var tree = node.$el.find('.tree:first');
                      if (tree.hasClass('in')) {
                        node.$el.addClass('open');
                      } else {
                        node.$el.removeClass('open');
                      }
                    }
                    actionEl.on('click', function(event) {
                      if (node.isLeaf()) {
                        $elm.find('[role=presentation]').removeClass('active');
                        utils.forEach(node.getHierarchy(), function(n) {
                          if (n.$el) {
                            n.$el.addClass('active');
                          }
                        });
                      } else {
                        var tree = node.$el.find('.tree:first');
                        if (tree.hasClass('in')) {
                          node.$el.removeClass('open');
                        } else {
                          node.$el.addClass('open');
                        }
                        tree.collapse('toggle');
                        event.preventDefault();
                        event.stopPropagation();
                      }
                    });
                    if (node.handler) {
                      actionEl.on('click', node.handler.bind(node));
                    }
                  });
                });
                if (theme.init) {
                  theme.init($elm);
                }
                $('.subdropdown [data-toggle=dropdown]').on('click', function(event) {
                  event.preventDefault();
                  event.stopPropagation();
                  $(this).parent().siblings().removeClass('open');
                  $(this).parent().toggleClass('open');
                });
                $compile($elm.children())($scope);
              }
            }
            $scope.$watch(getRoot, function(val, nval) {
              $elm.empty();
              render();
            });
            render();
          }
        };
      }
    };
  }])
  .config(['themeConfigProvider', function(themeConfigProvider) {
    themeConfigProvider.registerThemeConfig('tree', function(opt) {
      var theme = {};
      theme.menuTmpl = _.template(opt.menuTmpl);
      theme.nodeTmpl = _.template(opt.nodeTmpl);
      theme.rootTmpl = _.template(opt.rootTmpl);
      theme.init = opt.init;
      theme.nodeInit = opt.nodeInit;
      return theme;
    });

    var defMenuTmpl = '<ul class="tree tree-sub <%=expand ? "collapse in":"collapse"%>" role="menu"></ul>';
    var defNodeTmpl = '<li role="presentation" class="tree-node <%=$leaf ? "leaf" : "node"%>"><a role="menuitem" class="tree-node-action" <%if($leaf){%> href="<%=href%>" <%if(router){%>ui-sref="<%=router%>"<%}}else{%> href="javascript:void(0);"<%}%>><%=text%><span class="fa fa-caret"></span></a></li>'
    var defRootTmpl = '<li role="presentation" class="tree-node root <%=$leaf ? "leaf" : "node"%>"><a role="menuitem" class="tree-node-action" href="javascript:void(0);"><%=text%><span class="fa fa-caret"></span></a></li>';
    themeConfigProvider.addTheme('tree', 'theme.default', {
      menuTmpl: defMenuTmpl,
      nodeTmpl: defNodeTmpl,
      rootTmpl: defRootTmpl,
    });/*
    themeConfigProvider.addTheme('tree', 'theme.dropdown', {
      menuTmpl: defMenuTmpl,
      nodeTmpl: defNodeTmpl,
      rootTmpl: defRootTmpl,
      init: function($elm) {
        $elm.find('.tree').removeClass('in');
        $elm.addClass('dropdown');
      },
      nodeInit: function($elm, node) {
        node.$el.find('[role=menuitem]:first').on('click', function(event) {
          if (node.isLeaf()) {
            angular.forEach($elm.find('.tree'), function(el) {
              var elm = $(el);
              if (elm.hasClass('in')) {
                elm.collapse('toggle')
              }
            });
            $elm.find('.tree-node').removeClass('open');
          } else {
            angular.forEach(node.$el.parent().find('.tree'), function(el) {
              var elm = $(el);
              if (elm.hasClass('in')) {
                elm.collapse('toggle')
              }
            });
            $elm.find('.tree-node').removeClass('open');
          }
        });
      }
    });*/
  }]);

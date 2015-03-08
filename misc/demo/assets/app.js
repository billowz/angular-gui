angular.module('app', ['ngui', 'ui.router'])
  .factory('configService', ['utils', function(utils) {
    var cfgCache = {};
    return {
      getConfig: function() {
        return utils.deferred(function(def) {
          def.resolve(cfgCache);
        });
      },
      loadLocalConfig: function(cfg) {
        angular.extend(cfgCache, cfg);
      }
    };
  }])
  .factory('menuService', ['utils', 'TreeNode', function(utils, TreeNode) {

    function parseMenu(cfgs) {
      if (!angular.isArray(cfgs)) {
        cfgs = [cfgs];
      }
      return new TreeNode({
        option: {
          key: 'root',
          text: '',
          children: cfgs
        },
        applyData: function(node, option) {
          angular.extend(node, option);
        }
      });
    }

    var menuListeners = {};
    var menuCache = null;

    return {
      getMenu: function(path) {
        if (menuCache) {
          return utils.deferred(function(def) {
            def.resolve(path ? menuCache.findNode(path) : menuCache);
          });
        } else {
          // TODO   load menu from
          loadLocalMenu({});
        }
      },
      loadLocalMenu: function(cfg) {
        var oldCache = menuCache;
        menuCache = parseMenu(cfg);
        if (menuListeners.change) {
          angular.forEach(menuListeners.change, function(func) {
            func(menuCache, oldCache);
          });
        }
      },
      addMenuListener: function(eventName, handler) {
        if (!menuListeners[eventName]) {
          menuListeners[eventName] = [];
        }
        if (angular.isFunction(handler)) {
          menuListeners[eventName].push(handler);
          return true;
        }
        return false;
      },
      removeMenuListener: function(eventName, handler) {
        if (menuListeners[eventName]) {
          if (angular.isFunction(handler)) {
            var idx = menuListeners[eventName].indexOf(handler);
            if (idx !== -1) {
              menuListeners[eventName].splice(idx, 1);
            } else {
              return false;
            }
          } else {
            menuListeners[eventName] = [];
          }
          return true;
        }
        return false;
      }
    }
  }]);

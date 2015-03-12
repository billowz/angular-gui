"use strict"
angular.module('ngui.service', ['ngui.utils', 'ngui.tree', 'ngui.data'])
  .provider('configService', [function() {
    var _self = this;
    this.syncFunc = null;
    this.$get = ['utils', 'GlobalDataProvider', function(utils, GlobalDataProvider) {
      return new GlobalDataProvider('config', {
        syncFunc: _self.syncFunc,
        dataHandler: null
      });
    }]
  }])
  .provider('menuService', [function() {
    var _self = this;
    this.syncFunc = null;
    this.$get = ['utils', 'TreeNode', 'GlobalDataProvider', function(utils, TreeNode, GlobalDataProvider) {
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
      this.dataHandler = function(data) {
        return parseMenu(data);
      }
      return new GlobalDataProvider('menu', {
        syncFunc: _self.syncFunc,
        dataHandler: _self.dataHandler
      });
    }]
  }]);

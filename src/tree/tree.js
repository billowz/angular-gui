"use strict"
angular.module('ngui.tree', ['ngui.utils', 'ngui.transclude','ngui.collapse', 'ngui.fullscreen', 'ngui.if'])
.factory('TreeNode', ['utils', function(utils) {
    function TreeNode(option, parent, sync, syncFunc, keyParser, leafParser, applyData) {
      if(arguments.length === 1){
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
    TreeNode.prototype.getHierarchy = function(){
      var tmp = this, rs = [];
      while(tmp){
        rs.unshift(tmp);
        tmp = tmp.$parent;
      }
      return rs;
    }
    TreeNode.prototype.getChildren = function() {
      var _self = this;
      return utils.deferred(function(def){
        if(_self.loaded){
          def.resolve(_self.$children);
        }else{
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
        node = new TreeNode(option, _self, _self.$sync, _self.$syncFunc, _self.$keyParser, _self.$leafParser,_self.$applyData);
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
    TreeNode.prototype.isRoot = function(){
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
  }]);

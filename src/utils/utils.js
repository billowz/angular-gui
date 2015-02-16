"use strict"
angular.module('ngui.utils', ['ui.bootstrap.transition'])
  .factory('TreeNode', ['utils', function(utils) {
    function TreeNode(option, parent, keyParser, applyData) {
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
        this.data = option.data;
      }
      this.$children = [];
      this.$childrenMap = {};
      if (option.children) {
        this.addChildren(option.children);
      }
    }

    TreeNode.prototype.getKey = function() {
      return this.$key;
    }

    TreeNode.prototype.getChildren = function() {
      return this.$children;
    }
    TreeNode.prototype.hasChild = function() {
      return this.$children.length>0;
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
        node = new TreeNode(option, _self, _self.$keyParser, _self.$applyData);
        existNode = _self.$childrenMap[node.$key];
        if (existNode) {
          _self.$children[_self.$children.indexOf(existNode)] = node;
        } else {
          _self.$children.push(node);
        }
        _self.$childrenMap[node.$key] = node;
      }
    }

    TreeNode.prototype.getRoot = function() {
      var root = this;
      while (root.parent) {
        root = root.parent;
      }
      return root;
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
            if (!node) {
              console.log(_self);
            }
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
  .factory('utils', ['$q', '$transition', function($q, $transition) {
    function Transition() {
      this.currentTransition = null;
    }
    Transition.prototype.doTransition = function(element, change) {
      var _self = this;
      var newTransition = $transition(element, change);
      if (_self.currentTransition) {
        _self.currentTransition.cancel();
      }
      _self.currentTransition = newTransition;
      newTransition.then(function() {
        if (_self.currentTransition === newTransition) {
          _self.currentTransition = null;
        }
      });
      return newTransition;
    }

    var utils = {
      deferred: function(callback) {
        var deferred = $q.defer();
        callback(deferred);
        return deferred.promise;
      },
      isNull: function(val) {
        return val === undefined || val === null;
      },
      isBoolean: function(val) {
        return typeof val === 'boolean';
      },
      trim: function(str) {
        return angular.isString(str) ? str.replace(/(^\s*)|(\s*$)/g, "") : '';
      },
      forEach: function(obj, iterator, context) {
        var key, length;
        if (obj) {
          if (angular.isFunction(obj)) {
            for (key in obj) {
              // Need to check if hasOwnProperty exists,
              // as on IE8 the result of querySelectorAll is an object without a hasOwnProperty function
              if (key != 'prototype' && key != 'length' && key != 'name' && (!obj.hasOwnProperty || obj.hasOwnProperty(key))) {
                if (iterator.call(context, obj[key], key, obj) === false) {
                  return;
                }
              }
            }
          } else if (angular.isArray(obj) || angular.isArrayLike(obj)) {
            var isPrimitive = typeof obj !== 'object';
            for (key = 0, length = obj.length; key < length; key++) {
              if (isPrimitive || key in obj) {
                if (iterator.call(context, obj[key], key, obj) === false) {
                  return;
                }
              }
            }
          } else if (obj.forEach && obj.forEach !== forEach) {
            obj.forEach(iterator, context, obj);
          } else {
            for (key in obj) {
              if (obj.hasOwnProperty(key)) {
                if (iterator.call(context, obj[key], key, obj) === false) {
                  return;
                }
              }
            }
          }
        }
        return obj;
      },
      defaultVal: function(obj, attr, defVal) {
        if (!obj.hasOwnProperty(attr)) {
          obj[attr] = defVal;
        }
      },
      extendIf: function() {
        var copyIsArray, copy, name, options, clone,
          target = arguments[0] || {},
          i = 1,
          length = arguments.length;
        if (!angular.isObject(target) && !angular.isFunction(target)) {
          target = {};
        }
        if (i === length) {
          target = this;
          i--;
        }
        for (; i < length; i++) {
          if ((options = arguments[i]) != null) {
            for (name in options) {
              copy = options[name];
              if (target === copy) {
                continue;
              }
              if (!target.hasOwnProperty(name)) {
                target[name] = copy;
              }
            }
          }
        }
        return target;
      },
      createTransition: function() {
        return new Transition();
      }
    };
    return utils;
  }]);

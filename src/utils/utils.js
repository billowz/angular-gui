"use strict"
angular.module('ngui.utils', ['ui.bootstrap.transition'])
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
      concatFunc: function(func1, func2, scope) {
        if (func1 && func2) {
          return function() {
            func1.apply(scope || this, arguments);
            func2.apply(scope || this, arguments);
          }
        }
        return func1 || func2;
      },
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
      upperFirstChar: function(str) {
        return str.replace(/\b(\w)/g, function(m) {
          return m.toUpperCase();
        });
      },
      replaceSpaces: function(str, char) {
        return str.replace(/\s+/g, char);
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
      eachTreeLeaf: function(tree, childrenKey, callback, isLeaf){
        this.eachTree(tree, childrenKey, function(node){
          var leaf = false;
          if(isLeaf){
            if(angular.isString(isIeaf)){
              leaf = node[isLeaf];
            }else if(angular.isFunction(isLeaf)){
              leaf = isLeaf(node);
            }
          }else{
            leaf = !tree[childrenKey] || tree[childrenKey].length === 0;
          }
          if(leaf){
            callback(node);
          }
        });
      },
      eachTree: function(tree, childrenKey, callback){
        var _self = this;
        if (!angular.isFunction(callback)) {
          return;
        }
        if (angular.isArray(tree)) {
          angular.forEach(tree, function(item) {
            _self.eachTree(item, childrenKey, callback);
          });
          return;
        }
        callback(tree);
        if (tree[childrenKey]) {
          angular.forEach(tree[childrenKey], function(item) {
            _self.eachTree(item, childrenKey, callback);
          });
        }
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

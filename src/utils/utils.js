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

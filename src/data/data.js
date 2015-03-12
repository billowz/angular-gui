"use strict"
angular.module('ngui.data', [])
  .provider('GlobalDataProvider', [function() {
    function defaultDataHandler(data) {
      return data;
    }
    function defaultSyncFunc(success, err) {}
    this.defaultDataHandler = defaultDataHandler;
    this.defaultSyncFunc = defaultSyncFunc;

    this.$get = ['$timeout', function($timeout) {
      function GlobalDataProvider(name, opt) {
        var _self = this;
        _self.name = name;
        _self.__dataCache = null;
        _self.__listenerIdx = 0;
        _self.__dataListeners = {};
        _self.__status;

        opt = opt || {};
        _self.opt = opt;
        _self.dataHandler = angular.isFunction(opt.dataHandler) ? opt.dataHandler : defaultDataHandler;
        _self.syncFunc = angular.isFunction(opt.syncFunc) ? opt.syncFunc : defaultSyncFunc;
        if (opt.defaultData) {
          _self.__cache(opt.defaultData);
        }
      }
      GlobalDataProvider.prototype.__cache = function(data) {
        var _self = this,
          data = _self.dataHandler ? _self.dataHandler(data) : data;
        if (_self.__dataCache !== data && data) {
          var oldCache = _self.__dataCache;
          _self.__dataCache = data;
          angular.forEach(_self.__dataListeners, function(listen) {
            $timeout(function() {
              listen.callback.apply(listen, [data, oldCache]);
            });
          });
        }
        return _self;
      }
      GlobalDataProvider.prototype.__sync = function() {
        var _self = this;
        if (!_self.__status) {
          _self.__status = 'syncing';
          _self.syncFunc.apply(_self, [function(data) {
            _self.__cache(data);
          }, function() {
            angular.forEach(_self.__dataListeners, function(listen) {
              if (angular.isFunction(listen.errCallback)) {
                $timeout(function() {
                  listen.errCallback.apply(listen, arguments);
                });
              }
            });
          }]);
        }
      }
      GlobalDataProvider.prototype.listen = function(callback, errCallback) {
        var listen = new DataListener(callback, errCallback, this).listen();
        if (this.__dataCache) {
          listen.callback.apply(listen, [this.__dataCache]);
        }
        this.__sync();
        return listen;
      }

      function DataListener(callback, errCallback, GlobalDataProvider) {
        if (angular.isFunction(callback)) {
          this.callback = callback;
          this.errCallback = errCallback;
          this.GlobalDataProvider = GlobalDataProvider;
          this.__listenerKey = 'listen-' + (++this.GlobalDataProvider.__listenerIdx);
        } else {
          throw new Error('invalid Listener');
        }
      }
      DataListener.prototype.listen = function() {
        this.GlobalDataProvider.__dataListeners[this.__listenerKey] = this;
        return this;
      }
      DataListener.prototype.unListen = function() {
        delete this.GlobalDataProvider.__dataListeners[this.__listenerKey];
        return this;
      }
      DataListener.prototype.isListening = function() {
        return this.GlobalDataProvider.__dataListeners[this.__listenerKey] === this;
      }
      return GlobalDataProvider;
    }];
  }])

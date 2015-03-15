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
  .provider('processService', [function() {
    var _self = this,
      running = 'running',
      error = 'error',
      complete = 'complete',
      queue = [];

    function Task(process) {
      this.process = process && process >= 0 ? process : 0;
      this.status = running;
      this.handlers = [];
    }
    Task.prototype.onProcess = function(func) {
      if (angular.isFunction(func)) {
        var idx = this.handlers.indexOf(func);
        if (idx == -1)
          this.handlers.push(func);
      }
      return this;
    }
    Task.prototype.unProcess = function(func) {
      if (angular.isFunction(func)) {
        var idx = this.handlers.indexOf(func);
        if (idx != -1) {
          this.handlers.splice(idx, 1);
        }
      }
      return this;
    }
    Task.prototype.fireEvent = function() {
      var _self = this;
      angular.forEach(_self.handlers, function(h) {
        h(_self.process, _self.status);
      });
    }
    Task.prototype.setProcess = function(process) {
      if (this.status === running && this.process < process) {
        this.process = process <= 100 ? process : 100;
        if (this.process === 100) {
          this.status = complete;
        }
        this.fireEvent();
      }
      return this;
    }
    Task.prototype.complete = function() {
      this.setProcess(100);
    }
    Task.prototype.error = function() {
      if (this.status === running) {
        this.status = error;
        this.fireEvent();
      }
    }
    var listens = [];
    var firstTask;
    this.$get = ['utils', function(utils) {
      return {
        toggleTask: function() {
          firstTask = queue[0];
        },
        getCurrentTask: function(){
          return firstTask;
        },
        createProcessTask: function(defaultProcess) {
          var _self = this;
          var task = new Task(defaultProcess);
          queue.push(task);
          if (!firstTask) {
            _self.toggleTask();
          }
          var lisTask = firstTask && firstTask === task;
          if (lisTask) {
            angular.forEach(listens, function(func) {
              func(task);
            });
          }
          var event = function(process, status) {
            var lisTask = firstTask && firstTask === task;
            if (status !== running) {
              var idx = queue.indexOf(task);
              if (idx != -1) {
                queue.splice(idx, 1);
              }
              if (lisTask) {
                _self.toggleTask();
              }
              task.unProcess(event);
            }
            if (lisTask) {
              angular.forEach(listens, function(func) {
                func(task);
              });
            }
          };
          task.onProcess(event);
          return task;
        },
        listen: function(func) {
          if (angular.isFunction(func)) {
            listens.push(func);
          }
          return this;
        }
      }
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

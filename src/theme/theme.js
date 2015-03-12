"use strict"
angular.module('ngui.theme', [])
  .provider('themeConfig', [function() {
    var themeCfg = {};
    this.$get = function() {
      return {
        getTheme: function(key, name) {
          return themeCfg[key].themes[name];
        },
        getThemes: function(key) {
          var themes = [];
          if (themeCfg[key]) {
            for (var t in themeCfg[key].themes) {
              themes.push(t);
            }
          }
          return themes;
        }
      }
    };
    this.registerThemeConfig = function(key, themeCheckFunc) {
      themeCfg[key] = {
        themeCheckFunc: themeCheckFunc,
        themes: {}
      }
    }
    this.addTheme = function(key, name, opt) {
      if (themeCfg[key]) {
        if (angular.isFunction(themeCfg[key].themeCheckFunc)) {
          opt = themeCfg[key].themeCheckFunc(opt);
        }
        if (opt) {
          themeCfg[key].themes[name] = opt;
        }
      }
    }
  }])

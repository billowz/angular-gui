"use strict"
angular.module('ngui.transclude', ['ngui.utils'])
  .directive('nguiTransclude', ['utils', function(utils) {
    var splitExpReg = /\s*,\s*/g;

    function hasTag(tags, el) {
      return tags.toUpperCase().split(splitExpReg).indexOf(el.tagName.toUpperCase()) !== -1;
    }

    function hasAttrs(attrs, $el) {
      var arr = attrs.split(splitExpReg);
      for (var i = 0; i < arr.length; i++) {
        if (!utils.isNull($el.attr(arr[i]))) {
          return true;
        }
      }
      return false;
    }

    function hasCls(cls, $el) {
      var arr = cls.split(splitExpReg);
      for (var i = 0; i < arr.length; i++) {
        if (!utils.isNull($el.hasClass(arr[i]))) {
          return true;
        }
      }
      return false;
    }

    function checkElement(attr, el) {
      var $el = angular.element(el);
      el = $el[0];
      return !((attr.includeTag && (!el.tagName || !hasTag(attr.includeTag, el))) || (attr.excludeTag && (el.tagName && hasTag(attr.excludeTag, el))) || (attr.includeAttr && (!el.tagName || !hasAttrs(attr.includeAttr, $el))) || (attr.excludeAttr && (el.tagName && hasAttrs(attr.excludeAttr, $el))) || (attr.includeCls && (!el.tagName || !hasCls(attr.includeCls, $el))) || (attr.excludeCls && (el.tagName && hasCls(attr.excludeCls, $el))));
    }

    return {
      restrict: 'EAC',
      link: function($scope, $element, $attrs, controller, $transclude) {
        if (!$transclude) {
          throw minErr('ngTransclude')('orphan',
            'Illegal use of ngTransclude directive in the template! ' +
            'No parent directive that requires a transclusion found. ');
        }

        $transclude(function(clone) {
          $element.empty();
          angular.forEach(clone, function(elem) {
            if (checkElement($attrs, elem)) {
              $element.append(elem);
            }
          });
        });
      }
    };
  }]);

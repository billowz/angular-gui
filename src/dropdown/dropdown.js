angular.module('ngui.dropdown', ['ngui.tree', 'ngui.utils'])
  .directive('nguiDropdown', ['utils', '$document', '$compile',
    function(utils, $document, $compile) {
      var __dropdownIdGen = 0;
      return {
        restrict: 'EA',
        replace: true,
        template: '<div class="dropdown" ngui-transclude></div>',
        transclude: true,
        link: function($scope, $element, $attrs) {
          var optKey = '__dropdownOptions__',
            i = 0,
            zTreeEl,
            setting;
          var id = $element.attr('id');
          if (!id) {
            id = 'dropdown-' + (++__dropdownIdGen);
            $element.attr('id', id);
          }
          var ztreeId = id + '-ztree';
          while ($scope[optKey]) {
            optKey = optKey + (++i);
          }
          var toggleFunc = 'toggle' + utils.upperFirstChar($attrs.dropdown);
          var isDropdownFunc = 'is' + utils.upperFirstChar($attrs.dropdown);
          var __onClickOther = function(event) {
            if ($(event.target).parents('#' + id).length === 0) {
              $scope[toggleFunc](false);
            }
          };
          $scope[toggleFunc] = function(dropdown) {
            if (utils.isNull(dropdown)) {
              dropdown = !$scope[isDropdownFunc]();
            }
            if (dropdown) {
              $element.children('#' + ztreeId).show();
              $document.bind('click', __onClickOther);
            } else {
              $element.children('#' + ztreeId).hide();
              $document.unbind('click', __onClickOther);
              var zTree = $.fn.zTree.getZTreeObj(ztreeId);
              zTree.expandAll(false);
            }
          }
          $scope[isDropdownFunc] = function() {
            return $element.children('#' + ztreeId).css('display') === 'block';
          }
          setting = $scope.$eval($attrs.options) || {};
          setting.singleExpand = true;
          setting.onClickOther = null;

          setting.callback = setting.callback || {};
          setting.callback.onClick = utils.concatFunc(function(event, id, node) {
            var zTree = $.fn.zTree.getZTreeObj(id);
            zTree.expandNode(node, !node.open, node.open, null, true);
            if (!node.children || node.children.length === 0) {
              $scope[toggleFunc](false);
              if (angular.isFunction(setting.onDropdown)) {
                setting.onDropdown.apply(this, [zTree, node]);
              }
            }
          }, setting.callback.onClick);

          $scope[optKey] = setting;
          $element.append('<ul id="' + ztreeId + '" ngui-ztree="' + $attrs.nguiDropdown + '" options="' + optKey + '"></ul>');
          $compile($element.children('#' + ztreeId))($scope);
        }
      }
    }
  ]);

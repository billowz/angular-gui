"use strict"
angular.module('ngui.tree', ['ngui.utils', 'ngui.theme'])
  .directive('nguiZtree', ['utils', '$document', '$rootScope', '$compile',
    function(utils, $document, $rootScope, $compile) {
      var __treeIdGen = 0;

      function showIcon(treeId, treeNode) {
        return treeNode.icon || treeNode.iconSkin || treeNode.iconOpen || treeNode.iconClose;
      }
      return {
        restrict: 'EA',
        replace: true,
        template: '<ul class="ztree"></ul>',
        link: function($scope, $element, $attrs) {
          var id = $element.attr('id');
          if (!id) {
            id = 'tree-' + (++__treeIdGen);
            $element.attr('id', id);
          }
          var setting = $scope.$eval($attrs.options) || {};
          setting.data = setting.data || {};
          setting.data.key = setting.data.key || {};
          utils.extendIf(setting.data.key, {
            name: 'label',
            title: '',
            children: 'children',
            url: ''
          });
          setting.data.simpleData = setting.data.simpleData || {};
          utils.extendIf(setting.data.simpleData, {
            enable: false
          });
          setting.view = setting.view || {};
          utils.extendIf(setting.view, {
            dbClickExpand: false,
            expandSpeed: "fast",
            showLine: false,
            showIcon: showIcon
          });
          setting.callback = setting.callback || {};


          setting.callback.onExpand = utils.concatFunc(
            function(event, treeId, treeNode) {
              var el = $element.find('#' + treeNode.tId);
              if (treeNode.open) {
                el.addClass('open');
              } else {
                el.removeClass('open');
              }
            }, setting.callback.onExpand);
          // single expand
          if (setting.singleExpand) {
            var curExpandNode;
            setting.callback.onExpand = utils.concatFunc(
              function(event, treeId, treeNode) {
                curExpandNode = treeNode;
              }, setting.callback.onExpand);


            setting.callback.beforeExpand = utils.concatFunc(
              function(treeId, treeNode) {
                var pNode = curExpandNode ? curExpandNode.getParentNode() : null;
                var treeNodeP = treeNode.parentTId ? treeNode.getParentNode() : null;
                var zTree = $.fn.zTree.getZTreeObj(treeId);
                for (var i = 0, l = !treeNodeP ? 0 : treeNodeP.children.length; i < l; i++) {
                  if (treeNode !== treeNodeP.children[i]) {
                    zTree.expandNode(treeNodeP.children[i], false);
                  }
                }
                while (pNode) {
                  if (pNode === treeNode) {
                    break;
                  }
                  pNode = pNode.getParentNode();
                }
                if (!pNode) {
                  singlePath(zTree, treeNode);
                }
              }, setting.callback.beforeExpand);

            function singlePath(zTree, newNode) {
              if (newNode === curExpandNode) return;
              var rootNodes, tmpRoot, tmpTId, i, j, n;
              if (!curExpandNode) {
                tmpRoot = newNode;
                while (tmpRoot) {
                  tmpTId = tmpRoot.tId;
                  tmpRoot = tmpRoot.getParentNode();
                }
                rootNodes = zTree.getNodes();
                for (i = 0, j = rootNodes.length; i < j; i++) {
                  n = rootNodes[i];
                  if (n.tId != tmpTId) {
                    zTree.expandNode(n, false);
                  }
                }
              } else if (curExpandNode && curExpandNode.open) {
                if (newNode.parentTId === curExpandNode.parentTId) {
                  zTree.expandNode(curExpandNode, false);
                } else {
                  var newParents = [];
                  while (newNode) {
                    newNode = newNode.getParentNode();
                    if (newNode === curExpandNode) {
                      newParents = null;
                      break;
                    } else if (newNode) {
                      newParents.push(newNode);
                    }
                  }
                  if (newParents != null) {
                    var oldNode = curExpandNode;
                    var oldParents = [];
                    while (oldNode) {
                      oldNode = oldNode.getParentNode();
                      if (oldNode) {
                        oldParents.push(oldNode);
                      }
                    }
                    if (newParents.length > 0) {
                      zTree.expandNode(oldParents[Math.abs(oldParents.length - newParents.length) - 1], false);
                    } else {
                      zTree.expandNode(oldParents[oldParents.length - 1], false);
                    }
                  }
                }
              }
              this.curExpandNode = newNode;
            }
          }
          if (angular.isFunction(setting.onClickOther)) {
            var __onClickOther = function(event) {
              if ($(event.target).parents('#' + id).length === 0) {
                unbindClickDoc();
                setting.onClickOther($.fn.zTree.getZTreeObj(id));
              }
            };
            $element.on('click', function() {
              bindClickDoc();
            });
            var __bindClickDoc = false;
            var bindClickDoc = function() {
              if (!__bindClickDoc) {
                $document.bind('click', __onClickOther);
                __bindClickDoc = true;
              }
            }
            var unbindClickDoc = function() {
              if (__bindClickDoc) {
                $document.unbind('click', __onClickOther);
                __bindClickDoc = false;
              }
            }
          }
          if (setting.bindRouter) {
            setting.callback.onNodeCreated = utils.concatFunc(function(event, treeId, treeNode){
              var ck = setting.data.key.children;
              var el = $element.find('#'+treeNode.tId);
              if(treeNode[ck] && treeNode[ck].length>0){
                el.addClass('parent');
              }
              $compile(el)($scope);
            },setting.callback.onNodeCreated);

          }
          var getRoot = function() {
            if ($attrs.nguiZtree) {
              return $scope.$eval($attrs.nguiZtree);
            }
            return null;
          }

          function render(root) {
            $.fn.zTree.init($element, setting, root || []);
          }
          $scope.$watch(getRoot, function(val, nval) {
            render(val);
          });
          render(getRoot());
        }
      };
    }
  ]);

angular.module('ngui.dropdown', ['ngui.tree'])
.directive('nguiDropdown', ['utils','$compile','TreeNode', function(utils, $compile, TreeNode) {
    function initNode(node){
      node.href = node.href || 'javascript:void(0);';
      node.router = node.router || false;
      node.text = node.text || '';
      node.$el = null;
      node.$dropdown_root = node.$dropdown_root || false;
    }
    function parseNode(pel, node, excludeSelf, isRoot, actionTempl){
      if(excludeSelf){
        angular.forEach(node.$children, function(n){
          parseNode(pel, n, false, true, actionTempl);
        });
      }else{
        initNode(node);
        var li = $('<li class="tree-node"></li>');
        var action = $(actionTempl(node));
        li.data('treeNode', node);
        node.$el = li;
        li.append(action);
        if(!node.isLeaf()){
          li.addClass('dropdown' +(isRoot ? '':' dropdown-submenu'));
          action.addClass('dropdown-toggle');
          action.attr('data-toggle', 'dropdown');
          var cel = $('<ul class="dropdown-menu"></ul>');
          li.append(cel);
          angular.forEach(node.$children, function(n){
              parseNode(cel, n, false, false, actionTempl);
            });
        }
        pel.append(li);
      }
    }
    function parseDropdown(dropdownEl, node, tmpls){
      initNode(node);
      var nodeEl = $(tmpls.nodeTmpl(node));
      var actionEl = node.$dropdown_root ? $(tmpls.rootActionTmpl(node)): $(tmpls.nodeActionTmpl(node));
      nodeEl.append(actionEl);
      nodeEl.data('treeNode', node);
      node.$el = nodeEl;
      dropdownEl.append(nodeEl);
      if(node.handler){
        actionEl.on('click', node.handler);
      }
      if(!node.isLeaf()){
        var menuEl = $(tmpls.menuTmpl(node));
        nodeEl.append(menuEl);
        angular.forEach(node.$children, function(childNode){
          parseDropdown(menuEl, childNode, tmpls);
        });
      }
    }

    var menuTmpl = _.template('<ul class="dropdown-menu" role="menu"></ul>');
    var nodeTmpl = _.template('<li role="presentation" <%if(!$leaf){%>class="dropdown <%=$dropdown_root ? "":"subdropdown"%>"<%}%>></li>');
    var nodeActionTmpl = _.template('<a role="menuitem" href="<%=href%>"'
      +' <%if(router){%>ui-sref="<%=router%>"<%}%>'
      +' <%if(!$leaf){%>class="dropdown-toggle" data-toggle="dropdown"<%}%>'
      +'><%=text%>'
      +'</a>');
    var rootActionTmpl = nodeActionTmpl;
    return {
      restrict: 'EA',
      scope: {
        root:'=nguiDropdown'
      },
      template:'<ul class="dropdown"></ul>',
      replace: true,
      transclude: true,
      compile: function () {
        return {
          post: function ($scope, $elm, $attrs, uiGridCtrl) {
            var templs = {};
            function applyTempl(name, defaultTmpl){
              templs[name] = $attrs[name] ? _.template($attrs[name]) : defaultTmpl;
            }
            applyTempl('menuTmpl', menuTmpl);
            applyTempl('nodeTmpl', nodeTmpl);
            applyTempl('nodeActionTmpl', nodeActionTmpl);
            applyTempl('rootActionTmpl', rootActionTmpl);
            $scope.templs = templs;
            function render(){
              if($scope.root && $scope.root instanceof TreeNode){
                var menu = $scope.rootDisplay ? [$scope.root] : $scope.root.$children;
                angular.forEach(menu, function(node){
                  node.$dropdown_root = true;
                  parseDropdown($elm, node, templs);
                });
                $('.subdropdown [data-toggle=dropdown]').on('click', function(event) {
                  event.preventDefault();
                  event.stopPropagation();
                  if($attrs.autoClose !== 'false'){
                    $(this).parent().siblings().removeClass('open');
                  }
                  $(this).parent().toggleClass('open');
                });
                $compile($elm.children())($scope);
              }
            }
            $scope.$watch('root', function(val, nval){
              $elm.empty();
              render();
            });
            render();
          }
        };
      }
    };
  }]);

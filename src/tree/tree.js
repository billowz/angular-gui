"use strict"
angular.module('ngui.tree', ['ngui.utils', 'ngui.transclude','ngui.collapse', 'ngui.fullscreen', 'ngui.if'])
  .directive('nguiTree', ['utils','$compile','TreeNode', function(utils, $compile, TreeNode) {
  	function parseNode(pel, node, excludeSelf, isRoot, templ){
  		if(excludeSelf){
  			angular.forEach(node.$children, function(n){
  				parseNode(pel, n, false, true, templ);
  			});
  		}else{
  			var li = $('<li></li>');
  			var action = $(templ(node));
  			li.data('treeNode', node);
  			li.append(action);
  			if(!node.isLeaf()){
  				li.addClass('dropdown' +(isRoot ? '':' dropdown-submenu'));
  				action.addClass('dropdown-toggle');
  				action.attr('data-toggle', 'dropdown');
  				var cel = $('<ul class="dropdown-menu"></ul>');
  				li.append(cel);
  				angular.forEach(node.$children, function(n){
      				parseNode(cel, n, false, false, templ);
      			});
  			}
  			pel.append(li);
  		}
  	}
    return {
      restrict: 'EA',
      template: '<ul></ul>',
      scope: {
      	root:'=nguiTree'
      },
      replace: true,
      transclude: true,
      controller: ['$scope', function($scope){
      }],
      compile: function () {
        return {
          post: function ($scope, $elm, $attrs, uiGridCtrl) {
            $scope.click = function(){
              console.log(arguments);
            }
            $scope.templ = _.template($attrs.treeTemplate || '<a href="<%=((typeof href!=="undefined") && href) ? href:"#"%>" <%if((typeof router!=="undefined") && router){%>ui-sref="<%=router%>"<%}%>  ng-click="click($event)"><%=text%></a>');
          	function parse(){
          		if($scope.root && $scope.root instanceof TreeNode){
          			parseNode($elm, $scope.root, !$scope.rootDisplay, true, $scope.templ);
          			$('.dropdown-submenu [data-toggle=dropdown]').on('click', function(event) {
    							event.preventDefault();
    							event.stopPropagation();
    							$(this).parent().siblings().removeClass('open');
    							$(this).parent().toggleClass('open');
    						});
                $compile($elm.children())($scope);
          		}
          	}

			      parse();
          	$scope.$watch('root', function(val, nval){
        			$elm.empty();
        			parse();
          	});
          }
        };
      }
    };
  }]);

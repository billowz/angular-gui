"use strict"
angular.module('ngui.tree', ['ngui.utils', 'ngui.transclude','ngui.collapse', 'ngui.fullscreen', 'ngui.if'])
  .directive('nguiTree', ['utils','$compile','TreeNode', function(utils, $compile, TreeNode) {
  	function parseNode(pel, node, excludeSelf, isRoot){
		if(excludeSelf){
			angular.forEach(node.getChildren(), function(n){
				parseNode(pel, n, false, true);
			});
		}else{
			var li = $('<li></li>');
			var action = $('<a href="'+(node.href || node.router||'#')+'">'+node.text+'</a>');
			li.data('treeNode', node);
			li.append(action);
			if(node.hasChild()){
				li.addClass('dropdown' +(isRoot ? '':' dropdown-submenu'));
				action.addClass('dropdown-toggle');
				action.attr('data-toggle', 'dropdown');
				var cel = $('<ul class="dropdown-menu"></ul>');
				li.append(cel);
				angular.forEach(node.getChildren(), function(n){
    				parseNode(cel, n, false, false);
    			});
			}
			pel.append(li);
		}
	}

    return {
      restrict: 'EA',
      template: '<ul></ul>',
      scope: {
      	root:'=nguiTree',
      	rootDisplay: '@',
      	leafTemplate:  '@',
      	nodeTemplate: '@',
      	rootTemplate: '@'
      },
      replace: true,
      transclude: true,
      controller: ['$scope', function($scope){
      }],
      compile: function () {
          return {
            post: function ($scope, $elm, $attrs, uiGridCtrl) {
            	function parse(){
            		if($scope.root && $scope.root instanceof TreeNode){
            			parseNode($elm, $scope.root, !$scope.rootDisplay, true);
            			$('.dropdown-submenu [data-toggle=dropdown]').on('click', function(event) {
							event.preventDefault(); 
							event.stopPropagation(); 
							$(this).parent().siblings().removeClass('open');
							$(this).parent().toggleClass('open');
						});
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

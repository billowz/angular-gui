angular.module('ngui.demo').controller('TreeCtrl',['$scope','TreeNode',function ($scope, TreeNode) {
  var idx = 0;
  function randomTreeNode(parent, level, count){
    for(var i=0; i<count; i++){
      parent.children.push({
        text:'testTree-'+level+'-'+i,
        key:idx++,
        children:[]
      });
    }
  }
  function _randomTree(count){
    var treeOpt = {
      text:'testTree',
      key:idx++,
      children:[]
    };
    randomTreeNode(treeOpt, 1, count);
    angular.forEach(treeOpt.children, function(c){
      randomTreeNode(c, 2, count);
      angular.forEach(c.children, function(cc){
        randomTreeNode(cc, 3, count);
      });
    });
    return new TreeNode({option:treeOpt,
        applyData: function(node, option) {
          angular.extend(node, option);
        }});
  }
  $scope.randomTree = function(){
    var c = Math.random() *10;
    $scope.tree = _randomTree(c);
    console.log(c, $scope.tree);
  }
  $scope.randomTree();
}]);

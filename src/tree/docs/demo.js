angular.module('ngui.demo').controller('TreeCtrl',['$scope','TreeNode','$timeout',function ($scope, TreeNode, $timeout) {
  var idx = 0;
  function randomTreeNode(parent, level, count){
    for(var i=0; i<count; i++){
      parent.children.push({
        text:parent.text+'-'+i,
        key:idx++,
        children:[]
      });
    }
  }
  function _randomTree(name, count){
    var treeOpt = {
      text:name,
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
    var c = 20;
    $scope.tree = _randomTree('tree1',c);
    console.log(c, $scope.tree);
    $scope.tree2 = _randomTree('tree2',c);
  }
  $timeout($scope.randomTree, 50);
}]);

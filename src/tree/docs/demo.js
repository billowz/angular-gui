angular.module('ngui.demo').controller('TreeCtrl',['$scope','TreeNode','$timeout',function ($scope, TreeNode, $timeout) {
  var idx = 0;
  function randomTreeNode(parent, level, count){
    for(var i=0; i<count; i++){
      parent.children.push({
        label:parent.text+'-'+i,
        key:idx++,
        children:[]
      });
    }
  }
  function _randomTree(name, count){
    var treeOpt = {
      label:name,
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
    return treeOpt;
  }
  $scope.randomTree = function(){
    var c = Math.random() * 20;
    $scope.tree = _randomTree('tree1',c);
    var i = 0;
    console.log(c, i, $scope.tree);
    $scope.tree2 = _randomTree('tree2',c);
  }
  $timeout($scope.randomTree, 50);
}]);

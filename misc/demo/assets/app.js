angular.module('ngui.demo', ['ngui', 'ui.bootstrap'], function($httpProvider) {
  FastClick.attach(document.body);
  delete $httpProvider.defaults.headers.common['X-Requested-With'];
}).run(['$location', function($location) {
  //Allows us to navigate to the correct element on initialization
}]);


function MainCtrl($scope, $http, $document) {

}

angular.module('ngui.fullscreen', ['ui.bootstrap.transition', 'ngui.utils'])
.directive('nguiFullscreen', ['utils', '$window', function(utils, $window){
	return {
		restrict: 'A',
		link: function($scope, $element, $attrs) {
			window.e = $element;
			var resize = function(){
				if($scope[$attrs.nguiFullscreen]){
					$element.css({
						'position':'absolute',
						'z-index':9999999,
						width:angular.element($window).width(),
						height:angular.element($window).height()
					});
					$element.offset({left:0,top:0});
				}
			}
			var destory = function(){
				angular.element($window).off('resize', resize);
			}
			var scrolloverflows = [], hideoverflows = [];

			return $scope.$watch($attrs.nguiFullscreen, function(val, oldVal) {
				if (val == oldVal) {
					return;
				}
				if (val) {
					resize();
              		angular.element($window).on('resize', resize);
              		$element.on('$destroy', destory);
              		angular.forEach($element.parents(), function(elem){
              			elem = angular.element(elem);
              			if(elem.css('overflow')==='scroll'){
              				scrolloverflows.push(elem);
              				elem.css('overflow', 'hidden');
              			}
              		});
				}else{
					$element.off('$destroy', destory);
					destory();
					$element.css({
						'position':'initial',
						'z-index':0,
						width:'',
						height:''
					});
					if(scrolloverflows.length>0){
						angular.forEach(scrolloverflows, function(elem){
							elem.css('overflow', 'scroll');
						});
						scrolloverflows = [];
					}
				}
			});
		}
	}
}]);

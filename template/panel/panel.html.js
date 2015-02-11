angular.module("template/panel/panel.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("template/panel/panel.html",
    "<div class=\"panel panel-default ngui-panel\" ngui-fullscreen=\"fullscreened\">\n" +
    "  <div class=\"panel-heading\">\n" +
    "  	<span class=\"panel-title\" ng-bind=\"title\"></span>\n" +
    "  	<div class=\"actions\">\n" +
    "  		<button ngui-if=\"collapseable!==false\"\n" +
    "  			ng-disabled=\"$parent.fullscreened\"\n" +
    "  			ng-click=\"$parent.collapsed=!$parent.collapsed\"\n" +
    "  			ng-class=\"{'glyphicon-chevron-down':$parent.collapsed, 'glyphicon-minus':!$parent.collapsed}\"\n" +
    "  			class=\"action btn glyphicon\" >\n" +
    "  		</button>\n" +
    "  		<button ngui-if=\"fullscreenable!==false\"\n" +
    "  			ng-disabled=\"$parent.collapsed\"\n" +
    "  			ng-click=\"$parent.fullscreened=!$parent.fullscreened\"\n" +
    "  			ng-class=\"{'icon-shrink':$parent.fullscreened, 'icon-enlarge':!$parent.fullscreened}\"\n" +
    "  			class=\"action btn\" >\n" +
    "  		</button>\n" +
    "  	</div>\n" +
    "    </div>\n" +
    "  <div class=\"panel-body\" ngui-collapse=\"collapsed\" ng-transclude></div>\n" +
    "</div>\n" +
    "");
}]);

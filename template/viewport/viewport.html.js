angular.module("template/viewport/viewport.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("template/viewport/viewport.html",
    "<div class=\"viewport\">\n" +
    "    <div class=\"navigation\"></div>\n" +
    "    <div class=\"workspace\">\n" +
    "        <div class=\"container-fluid\" ngui-transclude>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>\n" +
    "");
}]);

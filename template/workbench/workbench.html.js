angular.module("template/workbench/workbench.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("template/workbench/workbench.html",
    "<div class=\"workbench\">\n" +
    "    <div class=\"navigation\"></div>\n" +
    "    <div class=\"workspace\">\n" +
    "        <div ngui-process></div>\n" +
    "        <div class=\"well\" ncy-breadcrumb>\n" +
    "        </div>\n" +
    "        <div class=\"container-fluid\" ngui-transclude>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>\n" +
    "");
}]);

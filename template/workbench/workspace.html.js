angular.module("template/workbench/workspace.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("template/workbench/workspace.html",
    "<div class=\"workspace\">\n" +
    "  <div class=\"container-fluid\">\n" +
    "      <div class=\"row\">\n" +
    "          <div class=\"col-md-12 an-scaleup-rotatefall\" ui-view >\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>\n" +
    "");
}]);

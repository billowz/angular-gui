angular.module("template/navigation/vertical.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("template/navigation/vertical.html",
    "<div class=\"navbar sidebar\" role=\"navigation\">\n" +
    "    <div class=\"container-fluid\">\n" +
    "        <div class=\"navbar-header\">\n" +
    "            <button type=\"button\" class=\"navbar-toggle\">\n" +
    "                <span class=\"sr-only\">Toggle navigation</span>\n" +
    "                <span class=\"icon-bar\"></span>\n" +
    "                <span class=\"icon-bar\"></span>\n" +
    "                <span class=\"icon-bar\"></span>\n" +
    "            </button>\n" +
    "            <a class=\"navbar-brand\" ng-bind=\"cfg.title\"></a>\n" +
    "        </div>\n" +
    "        <ul class=\"nav navbar-nav\" ng-include=\"'template/navigation/theme.html'\">\n" +
    "        </ul>\n" +
    "    </div>\n" +
    "\n" +
    "  <ul ngui-ztree=\"menu\" options=\"menuOptions\" class=\" nav navbar-nav\">\n" +
    "  </ul>\n" +
    "</div>\n" +
    "");
}]);

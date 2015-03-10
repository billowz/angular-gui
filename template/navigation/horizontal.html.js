angular.module("template/navigation/horizontal.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("template/navigation/horizontal.html",
    "<div class=\"navbar navbar-inverse navbar-static-top\" role=\"navigation\">\n" +
    "    <div class=\"container-fluid\">\n" +
    "        <div class=\"navbar-header\">\n" +
    "            <a class=\"navbar-brand\" ng-bind=\"getTitle()\"></a>\n" +
    "            <button type=\"button\" class=\"navbar-toggle\" data-toggle=\"collapse\" data-target=\".navbar-collapse\">\n" +
    "                <span class=\"sr-only\">Toggle navigation</span>\n" +
    "                <span class=\"icon-bar\"></span>\n" +
    "                <span class=\"icon-bar\"></span>\n" +
    "                <span class=\"icon-bar\"></span>\n" +
    "            </button>\n" +
    "        </div>\n" +
    "        <ul class=\"nav navbar-right top-nav\">\n" +
    "        </ul>\n" +
    "        <div class=\"collapse navbar-collapse\">\n" +
    "            <ul ngui-dropdown=\"getMenu()\" auto-close=\"false\" class=\"nav navbar-nav\">\n" +
    "            </ul>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>\n" +
    "");
}]);

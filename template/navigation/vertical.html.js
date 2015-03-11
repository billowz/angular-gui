angular.module("template/navigation/vertical.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("template/navigation/vertical.html",
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
    "        <ul class=\"nav navbar-right \">\n" +
    "            <li role=\"presentation\" class=\"dropdown\">\n" +
    "              <a role=\"menuitem\" href=\"javascript:void(0);\" data-toggle=\"dropdown\" class=\"dropdown-toggle\">Theme</a>\n" +
    "              <ul class=\"dropdown-menu\">\n" +
    "                <li role=\"presentation\" ng-repeat=\"theme in supportThemes\">\n" +
    "                <a href=\"javascript:void(0)\" ng-click=\"cfg.navtheme=theme\" ng-bind=\"theme\"></a>\n" +
    "                </li>\n" +
    "              </ul>\n" +
    "            </li>\n" +
    "          </ul>\n" +
    "        <div class=\"collapse navbar-collapse sidebar\">\n" +
    "            <ul ngui-dropdown=\"getMenu()\" theme=\"menu\" auto-close=\"false\" class=\"nav navbar-nav side-nav\">\n" +
    "            </ul>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>\n" +
    "");
}]);

angular.module("template/navigation/theme.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("template/navigation/theme.html",
    "<li role=\"presentation\" class=\"dropdown\">\n" +
    "    <a role=\"menuitem\" href=\"javascript:void(0);\" data-toggle=\"dropdown\" class=\"dropdown-toggle\">Layout</a>\n" +
    "    <ul class=\"dropdown-menu\">\n" +
    "        <li role=\"presentation\" ng-repeat=\"t in supportThemes\" ng-class=\"{active:currentTheme === t}\">\n" +
    "            <a href=\"javascript:void(0);\" ng-click=\"cfg.theme=t.$name\" ng-bind=\"t.label || t.$name\"></a>\n" +
    "        </li>\n" +
    "    </ul>\n" +
    "</li>\n" +
    "<li role=\"presentation\" class=\"dropdown\">\n" +
    "    <a role=\"menuitem\" href=\"javascript:void(0);\" data-toggle=\"dropdown\" class=\"dropdown-toggle\">Skin</a>\n" +
    "    <ul class=\"dropdown-menu\">\n" +
    "        <li role=\"presentation\" ng-repeat=\"t in supportSkins\" ng-class=\"{active:currentSkin === t}\">\n" +
    "            <a href=\"javascript:void(0);\" ng-click=\"cfg.skin=t.name\" ng-bind=\"t.label || t.$name\" ></a>\n" +
    "        </li>\n" +
    "    </ul>\n" +
    "</li>\n" +
    "");
}]);

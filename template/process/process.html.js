angular.module("template/process/process.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("template/process/process.html",
    "<div class=\"app-progress progress\">\n" +
    "    <div class=\"progress-bar\" role=\"progressbar\" aria-valuenow=\"100\" aria-valuemin=\"0\" aria-valuemax=\"100\" >\n" +
    "        <span class=\"sr-only\">0%</span>\n" +
    "    </div>\n" +
    "</div>\n" +
    "");
}]);

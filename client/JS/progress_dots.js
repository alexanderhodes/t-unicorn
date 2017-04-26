/**
 * Created by vladimirdoroch on 29.12.16.
 */
function setProgressCircles (count, current) {
  var html;

  // open tag of html list
  html = "<ul id=\"progress_circles\">";

  for (var i = 1; i <= count; i++){
    if (i < current){ html += "<li class=\"done\" ></li>" }
    if (i == current){ html += "<li class=\"current\" ></li>" }
    if (i > current){ html += "<li class=\"open\" ></li>" }
  }

  // end tag of html list
  html += "</ul>";

  return html;

}

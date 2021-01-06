"use strict";

/*
changes current mapping + sets cookie which button is pressed now
*/
function changeMapping(mapping) {
  var date = new Date();
  date.setTime(date.getTime() + 10000);
  document.cookie = "mapping=" + mapping + "; path=/; expires=" + date.toGMTString();

  switch (mapping) {
    case "dashboard":
      window.location = "/eforce-gallery/dashboard";
      break;

    case "newGallery":
      window.location = "/eforce-gallery/gallery/add";
      break;

    case "galleries":
      window.location = "/eforce-gallery/galleries";
      break;

    case "photos":
      window.location = "/eforce-gallery/photos";
      break;
  }
}
/*
calls function after window is loaded
*/


window.addEventListener("load", setClickedButton);
/*
sets clicked button after page is loaded
*/

function setClickedButton() {
  var value = parseCookie("mapping");
  console.log(document.cookie.split(";"));
  var div = document.getElementById("buttonDiv").children;
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = div[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var button = _step.value;

      if (button.value === value) {
        button.setAttribute("class", "navButton-selected");
      }
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator["return"] != null) {
        _iterator["return"]();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }
}
/*
parses cookies from browser by name
*/


function parseCookie(name) {
  var cookies = document.cookie.split(";");
  var map = new Map();
  var _iteratorNormalCompletion2 = true;
  var _didIteratorError2 = false;
  var _iteratorError2 = undefined;

  try {
    for (var _iterator2 = cookies[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
      var cookie = _step2.value;
      var oreo = cookie.split("=");
      map.set(parseName(oreo[0]), oreo[1]);
    }
  } catch (err) {
    _didIteratorError2 = true;
    _iteratorError2 = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion2 && _iterator2["return"] != null) {
        _iterator2["return"]();
      }
    } finally {
      if (_didIteratorError2) {
        throw _iteratorError2;
      }
    }
  }

  var returnValue = null;

  if (map.has(name)) {
    returnValue = map.get(name);
  }

  return returnValue;
}
/*
some cookie names has space before name, this function crop the space, or return name if it is without space
*/


function parseName(name) {
  var nameToReturn = "";

  if (name[0] === " ") {
    nameToReturn = name.substring(1);
  } else {
    nameToReturn = name;
  }

  return nameToReturn;
}
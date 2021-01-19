"use strict";

var _galleryFetcher = require("./galleryFetcher.js");

var _layoutGenerator = require("../photos/layoutGenerator.js");

function buildMainLayout(isGallerySelected) {
  var root, galTitles;
  return regeneratorRuntime.async(function buildMainLayout$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          root = document.createElement("div");
          document.body.appendChild(root);
          _context.next = 4;
          return regeneratorRuntime.awrap((0, _galleryFetcher.fetchAllGalleries)());

        case 4:
          galTitles = _context.sent;

          if (isGalleryInURL(galTitles)) {} else {
            root.appendChild(buildGalleryChooser(galTitles));
          }

        case 6:
        case "end":
          return _context.stop();
      }
    }
  });
}
/*
creates selector for galleries if gallery is not choosen
*/


function buildGalleryChooser(galTitles) {
  var div = document.createElement("div");
  var selector = document.createElement("input");
  selector.setAttribute("class", "text");
  selector.setAttribute("list", "galleryNames");
  var dataList = document.createElement("datalist");
  dataList.setAttribute("id", "galleryNames");
  var buffer = "";
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = galTitles[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var title = _step.value;
      buffer += "<option>" + title + "</option>";
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

  dataList.innerHTML = buffer;
  div.appendChild(selector);
  div.appendChild(dataList);
  selector.addEventListener("keyup", function (event) {
    if (event.key === "Enter" || event.key === undefined) {
      if (isStringInArray(selector.value, galTitles)) {
        console.log("fire");
      } else {
        if (selector.value.length > 0) {
          (0, _layoutGenerator.createPopupWindow)("Gallery with title \"" + selector.value + "\" does not exists");
        } else {
          (0, _layoutGenerator.createPopupWindow)("Please fill in gallery title or choose from list");
        }
      }
    }
  });
  return div;
}
/*
checks if gallery is in array and if url is not corrupted or empty
*/


function isGalleryInURL(galTitles) {
  console.log(galTitles);
  var url = new URL(window.location.href);
  var param = url.searchParams.get("gallery-title");

  if (param === null) {
    return false;
  }

  return isStringInArray(param, galTitles);
}
/*
returns logic value if is string in array
*/


function isStringInArray(string, array) {
  var _iteratorNormalCompletion2 = true;
  var _didIteratorError2 = false;
  var _iteratorError2 = undefined;

  try {
    for (var _iterator2 = array[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
      var s = _step2.value;

      if (s === string) {
        return true;
      }
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

  return false;
}

window.onload = function () {
  buildMainLayout(false);
};
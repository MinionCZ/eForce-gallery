"use strict";

var _galleryFetcher = require("./galleryFetcher.js");

var _layoutGenerator = require("../photos/layoutGenerator.js");

var _galleryStore = require("./galleryStore.js");

function buildMainLayout(isGallerySelected) {
  var root, galTitles, galleryTitle;
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

          if (!isGalleryInURL(galTitles)) {
            _context.next = 15;
            break;
          }

          galleryTitle = getGalleryFromURL();
          _context.t0 = _galleryStore.GalleryStore;
          _context.next = 10;
          return regeneratorRuntime.awrap((0, _galleryFetcher.fetchGalleryByTitle)(galleryTitle));

        case 10:
          _context.t1 = _context.sent;

          _context.t0.buildNewGallery.call(_context.t0, _context.t1);

          root.appendChild(buildGalleryChooser(galTitles, true, galleryTitle));
          _context.next = 16;
          break;

        case 15:
          root.appendChild(buildGalleryChooser(galTitles, false));

        case 16:
        case "end":
          return _context.stop();
      }
    }
  });
}
/*
creates selector for galleries if gallery is not choosen
*/


function buildGalleryChooser(galTitles, isSelected) {
  var selectedGallery = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "";
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
  var submitBtn = document.createElement("button");
  submitBtn.textContent = "Submit";
  div.appendChild(selector);
  div.appendChild(dataList);
  div.appendChild(submitBtn);
  selector.addEventListener("keyup", function (event) {
    if (event.key === "Enter") {
      if (isStringInArray(selector.value, galTitles)) {
        setNewGallery(selector.value);
      } else {
        if (selector.value.length > 0) {
          (0, _layoutGenerator.createPopupWindow)("Gallery with title \"" + selector.value + "\" does not exists");
        } else {
          (0, _layoutGenerator.createPopupWindow)("Please fill in gallery title or choose from list");
        }
      }
    }
  });

  submitBtn.onclick = function () {
    if (isStringInArray(selector.value, galTitles)) {
      setNewGallery(selector.value);
    } else {
      if (selector.value.length > 0) {
        (0, _layoutGenerator.createPopupWindow)("Gallery with title \"" + selector.value + "\" does not exists");
      } else {
        (0, _layoutGenerator.createPopupWindow)("Please fill in gallery title or choose from list");
      }
    }
  };

  if (isSelected) {
    selector.setAttribute("class", "selected gallery-fetcher-roll");
    submitBtn.setAttribute("class", "selected submit-button");
    div.setAttribute("class", "selected gallery-fetcher-div");
    selector.value = selectedGallery;
  } else {
    selector.setAttribute("class", "gallery-fetcher-roll");
    submitBtn.setAttribute("class", "submit-button");
    div.setAttribute("class", "gallery-fetcher-div");
  }

  return div;
}
/*
checks if gallery is in array and if url is not corrupted or empty
*/


function isGalleryInURL(galTitles) {
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

function setNewGallery(title) {
  var url;
  return regeneratorRuntime.async(function setNewGallery$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          url = new URL(window.location.href);
          url.searchParams.set("gallery-title", title);
          window.location.href = url;

        case 3:
        case "end":
          return _context2.stop();
      }
    }
  });
}

function getGalleryFromURL() {
  var url = new URL(window.location.href);
  return url.searchParams.get("gallery-title");
}

window.onload = function () {
  buildMainLayout(false);
};
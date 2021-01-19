"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.fetchAllGalleries = fetchAllGalleries;

/**
 * fetches info of all galleries
 * @returns returns array of strings with names of galleries
 */
function fetchAllGalleries() {
  var response;
  return regeneratorRuntime.async(function fetchAllGalleries$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return regeneratorRuntime.awrap(fetch("/eforce-gallery/galleries/get-all", {
            method: "GET",
            headers: {
              'Content-Type': 'application/json'
            }
          }));

        case 2:
          response = _context.sent;
          _context.t0 = parseGalleryTitles;
          _context.next = 6;
          return regeneratorRuntime.awrap(response.json());

        case 6:
          _context.t1 = _context.sent;
          return _context.abrupt("return", (0, _context.t0)(_context.t1));

        case 8:
        case "end":
          return _context.stop();
      }
    }
  });
}
/*
parses title from json
*/


function parseGalleryTitles(jsonTitles) {
  var titles = [];
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = jsonTitles[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var title = _step.value;
      titles.push(title.title);
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

  return titles;
}

function fetchGalleryByTitle() {
  return regeneratorRuntime.async(function fetchGalleryByTitle$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
        case "end":
          return _context2.stop();
      }
    }
  });
}
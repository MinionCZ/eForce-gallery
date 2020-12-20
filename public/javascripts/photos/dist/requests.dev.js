"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.downloadSelectedPhotos = downloadSelectedPhotos;

/*
sends request to download selected photos from backend
*/
function downloadSelectedPhotos(selectedPhotos, allPhotos, version, tags) {
  var data, response, respondedData, a;
  return regeneratorRuntime.async(function downloadSelectedPhotos$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          data = {
            photos: cropPhotos(selectedPhotos),
            allPhotos: allPhotos,
            version: version,
            tags: tags
          };
          _context.next = 3;
          return regeneratorRuntime.awrap(fetch("/download/generate-token-for-download", {
            method: "POST",
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
          }));

        case 3:
          response = _context.sent;
          _context.next = 6;
          return regeneratorRuntime.awrap(response.json());

        case 6:
          respondedData = _context.sent;
          a = document.createElement("a");
          a.href = window.location.origin + "/download/photos?downloadToken=" + respondedData.downloadToken;
          a.click();

        case 10:
        case "end":
          return _context.stop();
      }
    }
  });
}
/*
crops additional data from photo object, saves only file name which is mandatory for download
*/


function cropPhotos(photos) {
  var croppedPhotos = [];
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = photos[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var photo = _step.value;
      croppedPhotos.push(photo.fileName);
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

  return croppedPhotos;
}
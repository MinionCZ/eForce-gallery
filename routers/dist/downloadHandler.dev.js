"use strict";

var express = require('express');

var router = express.Router();

var tokenVerifier = require("../verifiers/token");

var uploadPath = "./photos/uploads/";

var path = require('path');

var fs = require('fs');

var photoDatabase = require("../databases/photoDatabase");

var PhotoConverter = require("./photoConverter");

var AdmZip = require('adm-zip');

var archiver = require("archiver");

router.post("/photo-gallery/download-whole-gallery", function _callee(request, response) {
  var token, galleryTitle, version, photos;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          token = request.cookies.token;

          if (tokenVerifier.isTokenValid(token, response)) {
            _context.next = 3;
            break;
          }

          return _context.abrupt("return");

        case 3:
          galleryTitle = request.body.title;
          version = request.body.version;
          console.log(request.body);
          tokenVerifier.refreshToken(token, response);

          if (!(version === "full")) {
            _context.next = 13;
            break;
          }

          response.setHeader('Content-Disposition', 'attachment; filename=' + galleryTitle + ".zip");
          _context.next = 11;
          return regeneratorRuntime.awrap(photoDatabase.getAllGalleryPhotos(galleryTitle));

        case 11:
          photos = _context.sent;
          createZipFromArray(galleryTitle, photos, version, response);

        case 13:
        case "end":
          return _context.stop();
      }
    }
  });
});

function createZipFromArray(galleryTitle, array, version, response) {
  var archive, filePath, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, photo, file;

  return regeneratorRuntime.async(function createZipFromArray$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          archive = archiver("zip", {
            store: true
          });
          filePath = __dirname + "/../photos/zips/" + galleryTitle + "-" + version + ".zip";
          _iteratorNormalCompletion = true;
          _didIteratorError = false;
          _iteratorError = undefined;
          _context2.prev = 5;

          for (_iterator = array[Symbol.iterator](); !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            photo = _step.value;
            file = uploadPath + photo;
            archive.append(fs.createReadStream(file), {
              name: photo
            });
          }

          _context2.next = 13;
          break;

        case 9:
          _context2.prev = 9;
          _context2.t0 = _context2["catch"](5);
          _didIteratorError = true;
          _iteratorError = _context2.t0;

        case 13:
          _context2.prev = 13;
          _context2.prev = 14;

          if (!_iteratorNormalCompletion && _iterator["return"] != null) {
            _iterator["return"]();
          }

        case 16:
          _context2.prev = 16;

          if (!_didIteratorError) {
            _context2.next = 19;
            break;
          }

          throw _iteratorError;

        case 19:
          return _context2.finish(16);

        case 20:
          return _context2.finish(13);

        case 21:
          archive.pipe(response);
          archive.on("end", function () {
            response.end();
          });
          archive.finalize();
          return _context2.abrupt("return", filePath);

        case 25:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[5, 9, 13, 21], [14,, 16, 20]]);
}

module.exports = router;
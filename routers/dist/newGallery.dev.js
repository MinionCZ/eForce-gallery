"use strict";

var express = require('express');

var router = express.Router();

var tokenVerifier = require("../verifiers/token");

var photoDatabase = require("../databases/photoDatabase");

function harvestTags(request) {
  var tags = JSON.parse(request.body.tagsValue);
  var tagArray = [];
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = tags[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var tag = _step.value;

      if (tag.tagValue !== "") {
        tagArray.push(tag.tagValue);
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

  return tagArray;
}

router.get("/gallery/add", function _callee(request, response) {
  var token;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          token = request.cookies.token;
          _context.next = 3;
          return regeneratorRuntime.awrap(tokenVerifier.isTokenValid(token, response));

        case 3:
          if (_context.sent) {
            _context.next = 5;
            break;
          }

          return _context.abrupt("return");

        case 5:
          token = tokenVerifier.refreshToken(token, response);
          response.render("newGallery.ejs");

        case 7:
        case "end":
          return _context.stop();
      }
    }
  });
});
router.post("/gallery/add", function _callee2(request, response) {
  var token, tempGalleryId;
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          token = request.cookies.token;
          tempGalleryId = request.cookies.galleryId;
          _context2.next = 4;
          return regeneratorRuntime.awrap(tokenVerifier.isTokenValid(token, response));

        case 4:
          if (_context2.sent) {
            _context2.next = 6;
            break;
          }

          return _context2.abrupt("return");

        case 6:
          token = tokenVerifier.refreshToken(token, response);

          if (parseInt(request.body.photoCounter) > 0) {
            photoDatabase.pushGalleryWithPhotos(tempGalleryId, request.body.title, request.body.label, harvestTags(request), request.body.date, tokenVerifier.getUsernameFromToken(token));
          } else {
            photoDatabase.pushGalleryWithoutPhotos(request.body.title, request.body.label, harvestTags(request), request.body.date, tokenVerifier.getUsernameFromToken(token));
          }

          response.render("newGallery.ejs");

        case 9:
        case "end":
          return _context2.stop();
      }
    }
  });
});
router.get("/galleries/fetch-titles-and-tags", function _callee3(request, response) {
  var token, galleries, titles, tags, _iteratorNormalCompletion2, _didIteratorError2, _iteratorError2, _iterator2, _step2, gallery, _iteratorNormalCompletion3, _didIteratorError3, _iteratorError3, _iterator3, _step3, tag, data;

  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          token = request.cookies.token;
          _context3.next = 3;
          return regeneratorRuntime.awrap(tokenVerifier.isTokenValid(token, response));

        case 3:
          if (_context3.sent) {
            _context3.next = 5;
            break;
          }

          return _context3.abrupt("return");

        case 5:
          token = tokenVerifier.refreshToken(token, response);
          _context3.next = 8;
          return regeneratorRuntime.awrap(photoDatabase.getAllGalleries());

        case 8:
          galleries = _context3.sent;
          titles = [];
          tags = new Set();
          _iteratorNormalCompletion2 = true;
          _didIteratorError2 = false;
          _iteratorError2 = undefined;
          _context3.prev = 14;
          _iterator2 = galleries[Symbol.iterator]();

        case 16:
          if (_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done) {
            _context3.next = 41;
            break;
          }

          gallery = _step2.value;
          titles.push(gallery.title);
          _iteratorNormalCompletion3 = true;
          _didIteratorError3 = false;
          _iteratorError3 = undefined;
          _context3.prev = 22;

          for (_iterator3 = gallery.tags[Symbol.iterator](); !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
            tag = _step3.value;
            tags.add(tag);
          }

          _context3.next = 30;
          break;

        case 26:
          _context3.prev = 26;
          _context3.t0 = _context3["catch"](22);
          _didIteratorError3 = true;
          _iteratorError3 = _context3.t0;

        case 30:
          _context3.prev = 30;
          _context3.prev = 31;

          if (!_iteratorNormalCompletion3 && _iterator3["return"] != null) {
            _iterator3["return"]();
          }

        case 33:
          _context3.prev = 33;

          if (!_didIteratorError3) {
            _context3.next = 36;
            break;
          }

          throw _iteratorError3;

        case 36:
          return _context3.finish(33);

        case 37:
          return _context3.finish(30);

        case 38:
          _iteratorNormalCompletion2 = true;
          _context3.next = 16;
          break;

        case 41:
          _context3.next = 47;
          break;

        case 43:
          _context3.prev = 43;
          _context3.t1 = _context3["catch"](14);
          _didIteratorError2 = true;
          _iteratorError2 = _context3.t1;

        case 47:
          _context3.prev = 47;
          _context3.prev = 48;

          if (!_iteratorNormalCompletion2 && _iterator2["return"] != null) {
            _iterator2["return"]();
          }

        case 50:
          _context3.prev = 50;

          if (!_didIteratorError2) {
            _context3.next = 53;
            break;
          }

          throw _iteratorError2;

        case 53:
          return _context3.finish(50);

        case 54:
          return _context3.finish(47);

        case 55:
          data = {
            titles: titles,
            tags: Array.from(tags)
          };
          response.json(data);

        case 57:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[14, 43, 47, 55], [22, 26, 30, 38], [31,, 33, 37], [48,, 50, 54]]);
});
module.exports = router;
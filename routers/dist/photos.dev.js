"use strict";

var express = require('express');

var router = express.Router();

var tokenVerifier = require("../verifiers/token");

var photoDatabase = require("../databases/photoDatabase");

router.get("/photos", function _callee(request, response) {
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
          response.render("allPhotos.ejs");

        case 7:
        case "end":
          return _context.stop();
      }
    }
  });
});
/*

*/

router.get("/get-all-photos", function _callee2(request, response) {
  var token;
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          token = request.cookies.token;
          _context2.next = 3;
          return regeneratorRuntime.awrap(tokenVerifier.isTokenValid(token, response));

        case 3:
          if (_context2.sent) {
            _context2.next = 5;
            break;
          }

          return _context2.abrupt("return");

        case 5:
          token = tokenVerifier.refreshToken(token, response);
          _context2.t0 = response;
          _context2.next = 9;
          return regeneratorRuntime.awrap(photoDatabase.filterPhotosByTags([], request.query.page, request.query.photosPerPage));

        case 9:
          _context2.t1 = _context2.sent;

          _context2.t0.json.call(_context2.t0, _context2.t1);

        case 11:
        case "end":
          return _context2.stop();
      }
    }
  });
});
router.post("/photos/delete", function _callee3(request, response) {
  var token, photosToDelete, data;
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
          photosToDelete = request.body.photos;

          if (!request.body.allPhotos) {
            _context3.next = 11;
            break;
          }

          _context3.next = 10;
          return regeneratorRuntime.awrap(photoDatabase.getAllPhotos(request.body.photos));

        case 10:
          photosToDelete = _context3.sent;

        case 11:
          photoDatabase.deletePhotos(photosToDelete, true);
          data = {
            deleted: photosToDelete.length + (photosToDelete.length === 1 ? " photo" : " photos") + " deleted"
          };
          response.json(data);

        case 14:
        case "end":
          return _context3.stop();
      }
    }
  });
});
module.exports = router;
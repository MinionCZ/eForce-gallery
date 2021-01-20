"use strict";

var express = require('express');

var router = express.Router();

var photoDatabase = require("../databases/photoDatabase");

router.get("/eforce-gallery/photos", function _callee(request, response) {
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          response.render("allPhotos.ejs");

        case 1:
        case "end":
          return _context.stop();
      }
    }
  });
});
/*
gets all photos on page
*/

router.get("/eforce-gallery/get-all-photos", function _callee2(request, response) {
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.t0 = response;
          _context2.next = 3;
          return regeneratorRuntime.awrap(photoDatabase.filterPhotosByTags([], request.query.page, request.query.photosPerPage));

        case 3:
          _context2.t1 = _context2.sent;

          _context2.t0.json.call(_context2.t0, _context2.t1);

        case 5:
        case "end":
          return _context2.stop();
      }
    }
  });
});
/*
deletes photos in request
*/

router.post("/eforce-gallery/photos/delete", function _callee3(request, response) {
  var photosToDelete, data;
  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          photosToDelete = request.body.photos;

          if (!request.body.allPhotos) {
            _context3.next = 5;
            break;
          }

          _context3.next = 4;
          return regeneratorRuntime.awrap(photoDatabase.getAllPhotos(request.body.photos));

        case 4:
          photosToDelete = _context3.sent;

        case 5:
          photoDatabase.deletePhotos(photosToDelete, true);
          data = {
            deleted: photosToDelete.length + (photosToDelete.length === 1 ? " photo" : " photos") + " deleted"
          };
          response.json(data);

        case 8:
        case "end":
          return _context3.stop();
      }
    }
  });
});
module.exports = router;
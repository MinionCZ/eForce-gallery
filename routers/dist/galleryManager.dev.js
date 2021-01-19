"use strict";

var express = require('express');

var router = express.Router();

var photoDatabase = require("../databases/photoDatabase");

router.post('/eforce-gallery/delete/gallery', function _callee(request, response) {
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return regeneratorRuntime.awrap(photoDatabase.deleteGalleryByID(request.body.galleryID));

        case 2:
          response.redirect("/eforce-gallery/dashboard");

        case 3:
        case "end":
          return _context.stop();
      }
    }
  });
});
router.get("/eforce-gallery/gallery-manager", function _callee2(request, response) {
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          response.render("galleryManager.ejs");

        case 1:
        case "end":
          return _context2.stop();
      }
    }
  });
});
module.exports = {
  router: router
};
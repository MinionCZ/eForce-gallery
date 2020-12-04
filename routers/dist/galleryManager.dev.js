"use strict";

var express = require('express');

var router = express.Router();

var tokenVerifier = require("../verifiers/token");

var photoDatabase = require("../databases/photoDatabase");

router.post('/delete/gallery', function _callee(request, response) {
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
          _context.next = 7;
          return regeneratorRuntime.awrap(photoDatabase.deleteGalleryByID(request.body.galleryID));

        case 7:
          response.redirect("/dashboard");

        case 8:
        case "end":
          return _context.stop();
      }
    }
  });
});
module.exports = {
  router: router
};
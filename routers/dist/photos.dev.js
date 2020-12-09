"use strict";

var express = require('express');

var router = express.Router();

var tokenVerifier = require("../verifiers/token");

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
          console.log("hello");
          response.render("allPhotos.ejs");

        case 8:
        case "end":
          return _context.stop();
      }
    }
  });
});
router.get("/get-all-photos", function _callee2(request, response) {
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
        case "end":
          return _context2.stop();
      }
    }
  });
});
module.exports = router;
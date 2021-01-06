"use strict";

var cookieParser = require('cookie-parser');

var express = require('express');

var router = express.Router();

var tokenVerifier = require("../verifiers/token");

router.get("/eforce-gallery/login", function (request, response) {
  var token = request.cookies.token;

  if (token === undefined) {
    response.render("login.ejs");
  } else {
    tokenVerifier.isTokenValid(token, response, true);
  }
});
router.post("/eforce-gallery/login", function _callee(request, response) {
  var token;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          token = request.cookies.token;

          if (!(token === undefined)) {
            _context.next = 9;
            break;
          }

          _context.next = 4;
          return regeneratorRuntime.awrap(tokenVerifier.generateNewAccessToken(request.body.username));

        case 4:
          token = _context.sent;
          response.cookie("token", token);
          response.redirect("/eforce-gallery/dashboard");
          _context.next = 10;
          break;

        case 9:
          tokenVerifier.isTokenValid(token, response, true);

        case 10:
        case "end":
          return _context.stop();
      }
    }
  });
});
module.exports = router;
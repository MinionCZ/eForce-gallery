"use strict";

var express = require('express');

var router = express.Router();

var tokenVerifier = require("../verifiers/token");

var data = require("../databases/userDatabase");

var photoDatabase = require("../databases/photoDatabase");

router.get("/dashboard", function _callee(request, response) {
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
          _context.t0 = response;
          _context.t1 = tokenVerifier.getUsernameFromToken(token);
          _context.t2 = JSON;
          _context.next = 11;
          return regeneratorRuntime.awrap(photoDatabase.getAllGalleries());

        case 11:
          _context.t3 = _context.sent;
          _context.t4 = _context.t2.stringify.call(_context.t2, _context.t3);
          _context.t5 = {
            name: _context.t1,
            galleries: _context.t4
          };

          _context.t0.render.call(_context.t0, "dashboard.ejs", _context.t5);

        case 15:
        case "end":
          return _context.stop();
      }
    }
  });
});
router.get("/galleries/get-all", function _callee2(request, response) {
  var token, allGaleries;
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
          console.log("response");
          token = tokenVerifier.refreshToken(token, response);
          _context2.next = 9;
          return regeneratorRuntime.awrap(photoDatabase.getAllGalleries());

        case 9:
          allGaleries = _context2.sent;
          response.json(allGaleries);

        case 11:
        case "end":
          return _context2.stop();
      }
    }
  });
});
module.exports = router;
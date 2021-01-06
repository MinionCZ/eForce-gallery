"use strict";

var jwt = require("jsonwebtoken");

var fs = require("fs");

var tokenSecret = "";
var fsPromises = fs.promises;

var tokenDatabase = require("../databases/tokenDatabase");

var sessions = new Map();

function initJWT() {
  return regeneratorRuntime.async(function initJWT$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _context.next = 3;
          return regeneratorRuntime.awrap(fsPromises.readFile(__dirname + "/../configs/JWTsecret.cfg"));

        case 3:
          tokenSecret = _context.sent;
          tokenSecret = tokenSecret.toString();
          _context.next = 10;
          break;

        case 7:
          _context.prev = 7;
          _context.t0 = _context["catch"](0);
          console.log(_context.t0);

        case 10:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 7]]);
}

function generateNewAccessToken(username) {
  var token;
  return regeneratorRuntime.async(function generateNewAccessToken$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          token = jwt.sign({
            username: username
          }, tokenSecret, {
            algorithm: 'HS256',
            expiresIn: "15m"
          });
          sessions.set(token, username);
          return _context2.abrupt("return", token);

        case 3:
        case "end":
          return _context2.stop();
      }
    }
  });
}

function isTokenValid(token, response) {
  var isLogin,
      valid,
      _args3 = arguments;
  return regeneratorRuntime.async(function isTokenValid$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          isLogin = _args3.length > 2 && _args3[2] !== undefined ? _args3[2] : false;
          valid = true;
          valid = jwt.verify(token, tokenSecret, function (err, decoded) {
            if (err) {
              return false;
            }

            return true;
          });

          if (valid) {
            valid = sessions.has(token);
          }

          if (!valid) {
            handleBadToken(response);
          }

          if (isLogin && valid) {
            response.redirect("/eforce-gallery/dashboard");
          }

          return _context3.abrupt("return", valid);

        case 7:
        case "end":
          return _context3.stop();
      }
    }
  });
}

function getUsernameFromToken(token) {
  var user = null;

  if (sessions.has(token)) {
    user = sessions.get(token);
  }

  return user;
}

function handleBadToken(response) {
  response.clearCookie("token");
  response.redirect("/eforce-gallery/unauthorized");
}

function refreshToken(token, response) {
  username = sessions.get(token);
  sessions["delete"](token);
  var newToken = jwt.sign({
    username: username
  }, tokenSecret, {
    algorithm: 'HS256',
    expiresIn: "15m"
  });
  sessions.set(newToken, username);
  response.cookie("token", newToken);
  return newToken;
}

module.exports = {
  initJWT: initJWT,
  generateNewAccessToken: generateNewAccessToken,
  isTokenValid: isTokenValid,
  getUsernameFromToken: getUsernameFromToken,
  refreshToken: refreshToken
};
"use strict";

var express = require('express');

var router = express.Router();

var tokenVerifier = require("../verifiers/token");

var multer = require('multer');

var uploadPath = "./photos/uploads";

var path = require('path');

var fs = require('fs');

var photoDatabase = require("../databases/photoDatabase");

var PhotoConverter = require("./photoConverter");

var databaseHelpers = require("../databases/databaseHelpers");

var storage = multer.diskStorage({
  destination: function destination(request, file, callback) {
    callback(null, uploadPath);
  },
  filename: function filename(request, file, callback) {
    var generateId = function generateId() {
      var chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
      var id = "";

      for (var i = 0; i < 16; i++) {
        id += chars[Math.floor(Math.random() * chars.length)];
      }

      return id;
    };

    request.body.photoId = generateId() + "-" + Date.now() + "" + path.extname(file.originalname);
    callback(null, request.body.photoId);
  }
});
var upload = multer({
  storage: storage
}).single("photo");
router.post("/gallery/photos/upload", function _callee2(request, response) {
  var token, username, galleryId;
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          token = request.cookies.token;

          if (tokenVerifier.isTokenValid(token, response)) {
            _context2.next = 3;
            break;
          }

          return _context2.abrupt("return");

        case 3:
          username = tokenVerifier.getUsernameFromToken(token);
          galleryId = request.cookies.galleryId;
          upload(request, response, function _callee(error) {
            return regeneratorRuntime.async(function _callee$(_context) {
              while (1) {
                switch (_context.prev = _context.next) {
                  case 0:
                    if (error) {
                      response.status(400);
                      response.json(JSON.stringify({
                        status: "error"
                      }));
                    } else {
                      PhotoConverter.handleNewPhoto(request.body.photoId, galleryId, username);
                      response.status(202);
                      response.json(JSON.stringify({
                        status: "success"
                      }));
                    }

                  case 1:
                  case "end":
                    return _context.stop();
                }
              }
            });
          });

        case 6:
        case "end":
          return _context2.stop();
      }
    }
  });
});
router.get("/photo-gallery/get-photo", function _callee3(request, response) {
  var token, galleryID, gallery, thumbnail;
  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          token = request.cookies.token;

          if (tokenVerifier.isTokenValid(token, response)) {
            _context3.next = 3;
            break;
          }

          return _context3.abrupt("return");

        case 3:
          galleryID = request.query.galleryID;
          _context3.next = 6;
          return regeneratorRuntime.awrap(photoDatabase.findGalleryByID(galleryID));

        case 6:
          gallery = _context3.sent;

          if (gallery.photos.length > 0) {
            thumbnail = PhotoConverter.convertPhotoNameToThumbnail(gallery.photos[0]);
            response.sendFile(path.resolve(__dirname + "/../photos/thumbnails/" + thumbnail));
          } else {
            response.sendFile(path.resolve(__dirname + "/../photos/no-photo/no-photo.png"));
          }

        case 8:
        case "end":
          return _context3.stop();
      }
    }
  });
});
router.get("/photo-gallery/get-all-tags-colors", function _callee4(request, response) {
  var token, colors;
  return regeneratorRuntime.async(function _callee4$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          token = request.cookies.token;

          if (tokenVerifier.isTokenValid(token, response)) {
            _context4.next = 3;
            break;
          }

          return _context4.abrupt("return");

        case 3:
          colors = fs.readFileSync(__dirname + "/../configs/colors.cfg");
          response.json(colors.toString());

        case 5:
        case "end":
          return _context4.stop();
      }
    }
  });
});
router.get("/photos/fetch-photo-by-id", function _callee5(request, response) {
  var token, fileName, thumbnail;
  return regeneratorRuntime.async(function _callee5$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          token = request.cookies.token;

          if (tokenVerifier.isTokenValid(token, response)) {
            _context5.next = 3;
            break;
          }

          return _context5.abrupt("return");

        case 3:
          fileName = request.query.fileName;
          thumbnail = request.query.thumbnail;

          if (thumbnail === "true") {
            response.sendFile(path.resolve(__dirname + "/../photos/thumbnails/" + databaseHelpers.getThumbnailFromFileName(fileName)));
          } else {
            response.sendFile(path.resolve(__dirname + "/../photos/lite-photos/" + fileName));
          }

        case 6:
        case "end":
          return _context5.stop();
      }
    }
  });
});
module.exports = {
  router: router
};
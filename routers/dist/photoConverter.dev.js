"use strict";

var sharp = require("sharp");

var savingPath = "./photos/thumbnails/";
var loadingPath = "./photos/uploads/";
var bigThumbnails = "./photos/big-thumbnails/";

var fs = require('fs');

var gm = require("gm");

var path = require("path");

var photoDatabase = require("../databases/photoDatabase");

function handleNewPhoto(fileName, galleryId, username) {
  var pathToPhoto, getThumbnailName, thumbnailName;
  return regeneratorRuntime.async(function handleNewPhoto$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          pathToPhoto = loadingPath + fileName;

          getThumbnailName = function getThumbnailName() {
            var thumbnail = path.basename(fileName, path.extname(fileName));
            thumbnail += "-th" + path.extname(fileName);
            return thumbnail;
          };

          thumbnailName = getThumbnailName();
          gm(pathToPhoto).thumbnail(420, 280).write(savingPath + thumbnailName, function (err) {});
          gm(pathToPhoto).size(function (err, size) {
            if (!err) {
              var height = size.height;
              var width = size.width;
              photoDatabase.insertTempPhoto(fileName, galleryId, username, width, height, thumbnailName);
              createLitePhoto(pathToPhoto, fileName);

              if (width > 1920 || height > 1080) {
                gm(pathToPhoto).thumbnail(1920, 1080).define("jpeg:extent=100kb").write(bigThumbnails + thumbnailName, function () {});
              } else {
                gm(pathToPhoto).define("jpeg:extent=100kb").write(bigThumbnails + thumbnailName, function () {});
              }
            }
          });

        case 5:
        case "end":
          return _context.stop();
      }
    }
  });
}

function convertPhotoNameToThumbnail(photoName) {
  var names = photoName.split(".");
  return names[0] + "-th." + names[1];
}

function createLitePhoto(pathToPhoto, fileName) {
  var lite, size, sizeInMB;
  return regeneratorRuntime.async(function createLitePhoto$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          lite = __dirname + "/../photos/lite-photos/" + fileName;
          size = fs.statSync(pathToPhoto).size;
          sizeInMB = size / 1000 / 1000;

          if (sizeInMB < 2.0) {
            fs.writeFileSync(lite, fs.readFileSync(pathToPhoto));
          } else {
            gm(pathToPhoto).resize(6144000, "@").write(lite, function _callee(err) {
              return regeneratorRuntime.async(function _callee$(_context2) {
                while (1) {
                  switch (_context2.prev = _context2.next) {
                    case 0:
                      if (err) {
                        size = fs.statSync(lite).size / 1000 / 1000;

                        if (size > 2.0) {
                          gm(lite).define("jpeg:extent=2mb").write(lite, function () {});
                        }
                      }

                    case 1:
                    case "end":
                      return _context2.stop();
                  }
                }
              });
            });
          }

        case 4:
        case "end":
          return _context3.stop();
      }
    }
  });
}

module.exports = {
  handleNewPhoto: handleNewPhoto,
  convertPhotoNameToThumbnail: convertPhotoNameToThumbnail
};
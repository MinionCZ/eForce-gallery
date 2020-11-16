"use strict";

var sharp = require("sharp");

var savingPath = "./photos/thumbnails/";
var loadingPath = "./photos/uploads/";

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
            console.log(thumbnail);
            thumbnail += "-th" + path.extname(fileName);
            return thumbnail;
          };

          thumbnailName = getThumbnailName();
          gm(pathToPhoto).thumbnail(420, 280).write(savingPath + thumbnailName, function (err) {});
          gm(pathToPhoto).identify(function (err, value) {
            if (!err) {
              var height = value.size.height;
              var width = value.size.width;
              photoDatabase.insertTempPhoto(fileName, galleryId, username, width, height, thumbnailName);
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

module.exports = {
  handleNewPhoto: handleNewPhoto,
  convertPhotoNameToThumbnail: convertPhotoNameToThumbnail
};
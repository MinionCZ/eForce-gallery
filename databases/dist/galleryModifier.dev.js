"use strict";

var databaseHelper = require("./databaseHelpers");

var client = null;
var photos = null;
var tempCollection = null;
var galleries = null;

function galleryModifierInit(clientInit) {
  client = clientInit;
  photos = client.db("eForceGallery").collection("photos");
  tempCollection = client.db("eForceGallery").collection("tempPhotos");
  galleries = client.db("eForceGallery").collection("galleries");
}

function updatePhoto(fileName, galleryID, add) {
  var gallery, galleryTitles, galleryIDs, index;
  return regeneratorRuntime.async(function updatePhoto$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return regeneratorRuntime.awrap(findGalleryByID(galleryID));

        case 2:
          gallery = _context.sent;
          galleryTitles = gallery.galleryTitles;
          galleryIDs = gallery.galleryIDs;

          if (add) {
            galleryIDs.push(galleryID);
            galleryTitles.push(gallery.galleryTitle);
          } else {
            index = galleryIDs.indexOf(galleryID);
            galleryIDs.splice(index, 1);
            galleryTitles.splice(index, 1);
          }

          photos.updateOne({
            fileName: fileName
          }, {
            $set: {
              galleryIDs: galleryIDs,
              galleryTitles: galleryTitles
            }
          });

        case 7:
        case "end":
          return _context.stop();
      }
    }
  });
}

function deleteGalleryByID(galleryID) {
  var gallery, photosToDestroy, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, photo;

  return regeneratorRuntime.async(function deleteGalleryByID$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.next = 2;
          return regeneratorRuntime.awrap(galleries.findOne({
            galleryID: galleryID
          }));

        case 2:
          gallery = _context2.sent;
          galleries.deleteOne({
            galleryID: galleryID
          });
          photosToDestroy = [];
          _iteratorNormalCompletion = true;
          _didIteratorError = false;
          _iteratorError = undefined;
          _context2.prev = 8;

          for (_iterator = gallery.photos[Symbol.iterator](); !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            photo = _step.value;

            if (photo.galleryIDs.length > 1) {
              updatePhoto(photo, gallery.galleryID, gallery.galleryTitle);
            } else {
              photosToDestroy.push(photo);
            }
          }

          _context2.next = 16;
          break;

        case 12:
          _context2.prev = 12;
          _context2.t0 = _context2["catch"](8);
          _didIteratorError = true;
          _iteratorError = _context2.t0;

        case 16:
          _context2.prev = 16;
          _context2.prev = 17;

          if (!_iteratorNormalCompletion && _iterator["return"] != null) {
            _iterator["return"]();
          }

        case 19:
          _context2.prev = 19;

          if (!_didIteratorError) {
            _context2.next = 22;
            break;
          }

          throw _iteratorError;

        case 22:
          return _context2.finish(19);

        case 23:
          return _context2.finish(16);

        case 24:
          databaseHelper.deleteManyPhotos(photos);

        case 25:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[8, 12, 16, 24], [17,, 19, 23]]);
}

module.exports = {
  deleteGalleryByID: deleteGalleryByID,
  galleryModifierInit: galleryModifierInit,
  updatePhoto: updatePhoto
};
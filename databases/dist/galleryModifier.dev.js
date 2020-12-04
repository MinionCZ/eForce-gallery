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

function findPhotoByFileName(fileName) {
  return regeneratorRuntime.async(function findPhotoByFileName$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.next = 2;
          return regeneratorRuntime.awrap(photos.findOne({
            fileName: fileName
          }));

        case 2:
          return _context2.abrupt("return", _context2.sent);

        case 3:
        case "end":
          return _context2.stop();
      }
    }
  });
}

function deletePhotos(photosToDelete) {
  return regeneratorRuntime.async(function deletePhotos$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          databaseHelper.deleteManyPhotos(photosToDelete);
          photos.deleteMany({
            fileName: {
              $in: photosToDelete
            }
          });

        case 2:
        case "end":
          return _context3.stop();
      }
    }
  });
}

function deleteGalleryByID(galleryID) {
  var gallery, photosToDelete, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, fileName, photo;

  return regeneratorRuntime.async(function deleteGalleryByID$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.next = 2;
          return regeneratorRuntime.awrap(galleries.findOne({
            galleryID: galleryID
          }));

        case 2:
          gallery = _context4.sent;
          galleries.deleteOne({
            galleryID: galleryID
          });
          photosToDelete = [];
          _iteratorNormalCompletion = true;
          _didIteratorError = false;
          _iteratorError = undefined;
          _context4.prev = 8;
          _iterator = gallery.photos[Symbol.iterator]();

        case 10:
          if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
            _context4.next = 19;
            break;
          }

          fileName = _step.value;
          _context4.next = 14;
          return regeneratorRuntime.awrap(findPhotoByFileName(fileName));

        case 14:
          photo = _context4.sent;

          if (photo.galleryIDs.length > 1) {
            updatePhoto(photo, gallery.galleryID, gallery.galleryTitle);
          } else {
            photosToDelete.push(fileName);
          }

        case 16:
          _iteratorNormalCompletion = true;
          _context4.next = 10;
          break;

        case 19:
          _context4.next = 25;
          break;

        case 21:
          _context4.prev = 21;
          _context4.t0 = _context4["catch"](8);
          _didIteratorError = true;
          _iteratorError = _context4.t0;

        case 25:
          _context4.prev = 25;
          _context4.prev = 26;

          if (!_iteratorNormalCompletion && _iterator["return"] != null) {
            _iterator["return"]();
          }

        case 28:
          _context4.prev = 28;

          if (!_didIteratorError) {
            _context4.next = 31;
            break;
          }

          throw _iteratorError;

        case 31:
          return _context4.finish(28);

        case 32:
          return _context4.finish(25);

        case 33:
          deletePhotos(photosToDelete);

        case 34:
        case "end":
          return _context4.stop();
      }
    }
  }, null, null, [[8, 21, 25, 33], [26,, 28, 32]]);
}

module.exports = {
  deleteGalleryByID: deleteGalleryByID,
  galleryModifierInit: galleryModifierInit,
  updatePhoto: updatePhoto
};
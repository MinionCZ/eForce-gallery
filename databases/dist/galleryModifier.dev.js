"use strict";

var databaseHelper = require("./databaseHelpers");

var fs = require("fs");

var client = null;
var photos = null;
var tempCollection = null;
var galleries = null;
/*
init function
*/

function galleryModifierInit(clientInit) {
  client = clientInit;
  photos = client.db("eForceGallery").collection("photos");
  tempCollection = client.db("eForceGallery").collection("tempPhotos");
  galleries = client.db("eForceGallery").collection("galleries");
}
/*
updates photo, mainly gallery titles and ids when they are erased
*/


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
/*
returns photo from db by its file name
*/


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
/*
delete photos from db and from disk
*/


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
/*
deletes gallery by her id
*/


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
/*
auto sync gallery with photo size sum, can be called with or without param with param sync only that gallery not all, sync every 24h
 */


function syncGallerySizes() {
  var galleryID,
      galleriesToSync,
      _iteratorNormalCompletion2,
      _didIteratorError2,
      _iteratorError2,
      _iterator2,
      _step2,
      gallery,
      size,
      galleryToSync,
      _size,
      _args5 = arguments;

  return regeneratorRuntime.async(function syncGallerySizes$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          galleryID = _args5.length > 0 && _args5[0] !== undefined ? _args5[0] : "";

          if (!(galleryID === "")) {
            _context5.next = 35;
            break;
          }

          _context5.next = 4;
          return regeneratorRuntime.awrap(galleries.find().toArray());

        case 4:
          galleriesToSync = _context5.sent;
          _iteratorNormalCompletion2 = true;
          _didIteratorError2 = false;
          _iteratorError2 = undefined;
          _context5.prev = 8;
          _iterator2 = galleriesToSync[Symbol.iterator]();

        case 10:
          if (_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done) {
            _context5.next = 19;
            break;
          }

          gallery = _step2.value;

          if (!(gallery.photos.length > 0)) {
            _context5.next = 16;
            break;
          }

          size = calculateSizeOfGallery(gallery);
          _context5.next = 16;
          return regeneratorRuntime.awrap(galleries.updateOne({
            galleryID: gallery.galleryID
          }, {
            $set: {
              fullSizeInMB: size.fullSize,
              liteSizeInMB: size.liteSize
            }
          }));

        case 16:
          _iteratorNormalCompletion2 = true;
          _context5.next = 10;
          break;

        case 19:
          _context5.next = 25;
          break;

        case 21:
          _context5.prev = 21;
          _context5.t0 = _context5["catch"](8);
          _didIteratorError2 = true;
          _iteratorError2 = _context5.t0;

        case 25:
          _context5.prev = 25;
          _context5.prev = 26;

          if (!_iteratorNormalCompletion2 && _iterator2["return"] != null) {
            _iterator2["return"]();
          }

        case 28:
          _context5.prev = 28;

          if (!_didIteratorError2) {
            _context5.next = 31;
            break;
          }

          throw _iteratorError2;

        case 31:
          return _context5.finish(28);

        case 32:
          return _context5.finish(25);

        case 33:
          _context5.next = 41;
          break;

        case 35:
          _context5.next = 37;
          return regeneratorRuntime.awrap(galleries.findOne({
            galleryID: galleryID
          }));

        case 37:
          galleryToSync = _context5.sent;
          _size = calculateSizeOfGallery(galleryToSync);
          _context5.next = 41;
          return regeneratorRuntime.awrap(galleries.updateOne({
            galleryID: galleryToSync.galleryID
          }, {
            $set: {
              fullSizeInMB: _size.fullSize,
              liteSizeInMB: _size.liteSize
            }
          }));

        case 41:
        case "end":
          return _context5.stop();
      }
    }
  }, null, null, [[8, 21, 25, 33], [26,, 28, 32]]);
}
/*
calculates size of gallery by summing its image sizes
*/


function calculateSizeOfGallery(gallery) {
  var fullSize = 0;
  var liteSize = 0;
  var fullPath = __dirname + "/../photos/uploads/";
  var litePath = __dirname + "/../photos/lite-photos/";
  console.log(gallery.photos);
  var _iteratorNormalCompletion3 = true;
  var _didIteratorError3 = false;
  var _iteratorError3 = undefined;

  try {
    for (var _iterator3 = gallery.photos[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
      var photo = _step3.value;

      if (fs.existsSync(fullPath + photo)) {
        fullSize += fs.statSync(fullPath + photo).size / 1000 / 1000;
      }

      if (fs.existsSync(litePath + photo)) {
        liteSize += fs.statSync(litePath + photo).size / 1000 / 1000;
      }
    }
  } catch (err) {
    _didIteratorError3 = true;
    _iteratorError3 = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion3 && _iterator3["return"] != null) {
        _iterator3["return"]();
      }
    } finally {
      if (_didIteratorError3) {
        throw _iteratorError3;
      }
    }
  }

  return {
    fullSize: fullSize,
    liteSize: liteSize
  };
}

setInterval(syncGallerySizes, 24 * 60 * 60 * 1000);
module.exports = {
  deleteGalleryByID: deleteGalleryByID,
  galleryModifierInit: galleryModifierInit,
  updatePhoto: updatePhoto,
  syncGallerySizes: syncGallerySizes
};
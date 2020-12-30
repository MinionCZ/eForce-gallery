"use strict";

var databaseHelper = require("./databaseHelpers");

var fs = require("fs");

var client = null;
var photos = null;
var galleries = null;
/*
init function
*/

function galleryModifierInit(clientInit) {
  client = clientInit;
  photos = client.db("eForceGallery").collection("photos");
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
param clearInDatabase is optional and useable, when only photos are selected
*/


function deletePhotos(photosToDelete) {
  var clearInDatabase,
      deleteMap,
      _iteratorNormalCompletion,
      _didIteratorError,
      _iteratorError,
      _iterator,
      _step,
      gallery,
      _args3 = arguments;

  return regeneratorRuntime.async(function deletePhotos$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          clearInDatabase = _args3.length > 1 && _args3[1] !== undefined ? _args3[1] : false;
          databaseHelper.deleteManyPhotos(photosToDelete);

          if (!clearInDatabase) {
            _context3.next = 25;
            break;
          }

          _context3.next = 5;
          return regeneratorRuntime.awrap(getGalleriesToClear(photosToDelete));

        case 5:
          deleteMap = _context3.sent;
          _iteratorNormalCompletion = true;
          _didIteratorError = false;
          _iteratorError = undefined;
          _context3.prev = 9;

          for (_iterator = deleteMap[Symbol.iterator](); !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            gallery = _step.value;
            deletePhotosFromGallery(gallery[0], gallery[1]);
          }

          _context3.next = 17;
          break;

        case 13:
          _context3.prev = 13;
          _context3.t0 = _context3["catch"](9);
          _didIteratorError = true;
          _iteratorError = _context3.t0;

        case 17:
          _context3.prev = 17;
          _context3.prev = 18;

          if (!_iteratorNormalCompletion && _iterator["return"] != null) {
            _iterator["return"]();
          }

        case 20:
          _context3.prev = 20;

          if (!_didIteratorError) {
            _context3.next = 23;
            break;
          }

          throw _iteratorError;

        case 23:
          return _context3.finish(20);

        case 24:
          return _context3.finish(17);

        case 25:
          photos.deleteMany({
            fileName: {
              $in: photosToDelete
            }
          });

        case 26:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[9, 13, 17, 25], [18,, 20, 24]]);
}
/*
creates map with databases and their photos which are going to be deleted and in which galleries they are
*/


function getGalleriesToClear(photosToDelete) {
  var deleteDatabaseMap, _iteratorNormalCompletion2, _didIteratorError2, _iteratorError2, _iterator2, _step2, filename, photo, _iteratorNormalCompletion3, _didIteratorError3, _iteratorError3, _iterator3, _step3, database;

  return regeneratorRuntime.async(function getGalleriesToClear$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          deleteDatabaseMap = new Map();
          _iteratorNormalCompletion2 = true;
          _didIteratorError2 = false;
          _iteratorError2 = undefined;
          _context4.prev = 4;
          _iterator2 = photosToDelete[Symbol.iterator]();

        case 6:
          if (_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done) {
            _context4.next = 33;
            break;
          }

          filename = _step2.value;
          _context4.next = 10;
          return regeneratorRuntime.awrap(findPhotoByFileName(filename));

        case 10:
          photo = _context4.sent;
          _iteratorNormalCompletion3 = true;
          _didIteratorError3 = false;
          _iteratorError3 = undefined;
          _context4.prev = 14;

          for (_iterator3 = photo.galleryTitles[Symbol.iterator](); !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
            database = _step3.value;

            if (!deleteDatabaseMap.has(database)) {
              deleteDatabaseMap.set(database, []);
              deleteDatabaseMap.get(database).push(filename);
            } else {
              deleteDatabaseMap.get(database).push(filename);
            }
          }

          _context4.next = 22;
          break;

        case 18:
          _context4.prev = 18;
          _context4.t0 = _context4["catch"](14);
          _didIteratorError3 = true;
          _iteratorError3 = _context4.t0;

        case 22:
          _context4.prev = 22;
          _context4.prev = 23;

          if (!_iteratorNormalCompletion3 && _iterator3["return"] != null) {
            _iterator3["return"]();
          }

        case 25:
          _context4.prev = 25;

          if (!_didIteratorError3) {
            _context4.next = 28;
            break;
          }

          throw _iteratorError3;

        case 28:
          return _context4.finish(25);

        case 29:
          return _context4.finish(22);

        case 30:
          _iteratorNormalCompletion2 = true;
          _context4.next = 6;
          break;

        case 33:
          _context4.next = 39;
          break;

        case 35:
          _context4.prev = 35;
          _context4.t1 = _context4["catch"](4);
          _didIteratorError2 = true;
          _iteratorError2 = _context4.t1;

        case 39:
          _context4.prev = 39;
          _context4.prev = 40;

          if (!_iteratorNormalCompletion2 && _iterator2["return"] != null) {
            _iterator2["return"]();
          }

        case 42:
          _context4.prev = 42;

          if (!_didIteratorError2) {
            _context4.next = 45;
            break;
          }

          throw _iteratorError2;

        case 45:
          return _context4.finish(42);

        case 46:
          return _context4.finish(39);

        case 47:
          return _context4.abrupt("return", deleteDatabaseMap);

        case 48:
        case "end":
          return _context4.stop();
      }
    }
  }, null, null, [[4, 35, 39, 47], [14, 18, 22, 30], [23,, 25, 29], [40,, 42, 46]]);
}
/*
delete photos from galleries, clears their existence in photo list
*/


function deletePhotosFromGallery(galleryTitle, photos) {
  var gallery, galleryPhotos, _iteratorNormalCompletion4, _didIteratorError4, _iteratorError4, _iterator4, _step4, photo;

  return regeneratorRuntime.async(function deletePhotosFromGallery$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          _context5.next = 2;
          return regeneratorRuntime.awrap(galleries.findOne({
            galleryTitle: galleryTitle
          }));

        case 2:
          gallery = _context5.sent;
          galleryPhotos = new Set(gallery.photos);
          _iteratorNormalCompletion4 = true;
          _didIteratorError4 = false;
          _iteratorError4 = undefined;
          _context5.prev = 7;

          for (_iterator4 = photos[Symbol.iterator](); !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
            photo = _step4.value;
            galleryPhotos["delete"](photo);
          }

          _context5.next = 15;
          break;

        case 11:
          _context5.prev = 11;
          _context5.t0 = _context5["catch"](7);
          _didIteratorError4 = true;
          _iteratorError4 = _context5.t0;

        case 15:
          _context5.prev = 15;
          _context5.prev = 16;

          if (!_iteratorNormalCompletion4 && _iterator4["return"] != null) {
            _iterator4["return"]();
          }

        case 18:
          _context5.prev = 18;

          if (!_didIteratorError4) {
            _context5.next = 21;
            break;
          }

          throw _iteratorError4;

        case 21:
          return _context5.finish(18);

        case 22:
          return _context5.finish(15);

        case 23:
          _context5.next = 25;
          return regeneratorRuntime.awrap(galleries.updateOne({
            galleryTitle: galleryTitle
          }, {
            $set: {
              photos: Array.from(galleryPhotos)
            }
          }));

        case 25:
          syncGallerySizes(gallery.galleryID);

        case 26:
        case "end":
          return _context5.stop();
      }
    }
  }, null, null, [[7, 11, 15, 23], [16,, 18, 22]]);
}
/*
deletes gallery by her id
*/


function deleteGalleryByID(galleryID) {
  var gallery, photosToDelete, _iteratorNormalCompletion5, _didIteratorError5, _iteratorError5, _iterator5, _step5, fileName, photo;

  return regeneratorRuntime.async(function deleteGalleryByID$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          _context6.next = 2;
          return regeneratorRuntime.awrap(galleries.findOne({
            galleryID: galleryID
          }));

        case 2:
          gallery = _context6.sent;
          galleries.deleteOne({
            galleryID: galleryID
          });
          photosToDelete = [];
          _iteratorNormalCompletion5 = true;
          _didIteratorError5 = false;
          _iteratorError5 = undefined;
          _context6.prev = 8;
          _iterator5 = gallery.photos[Symbol.iterator]();

        case 10:
          if (_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done) {
            _context6.next = 19;
            break;
          }

          fileName = _step5.value;
          _context6.next = 14;
          return regeneratorRuntime.awrap(findPhotoByFileName(fileName));

        case 14:
          photo = _context6.sent;

          if (photo.galleryIDs.length > 1) {
            updatePhoto(photo, gallery.galleryID, gallery.galleryTitle);
          } else {
            photosToDelete.push(fileName);
          }

        case 16:
          _iteratorNormalCompletion5 = true;
          _context6.next = 10;
          break;

        case 19:
          _context6.next = 25;
          break;

        case 21:
          _context6.prev = 21;
          _context6.t0 = _context6["catch"](8);
          _didIteratorError5 = true;
          _iteratorError5 = _context6.t0;

        case 25:
          _context6.prev = 25;
          _context6.prev = 26;

          if (!_iteratorNormalCompletion5 && _iterator5["return"] != null) {
            _iterator5["return"]();
          }

        case 28:
          _context6.prev = 28;

          if (!_didIteratorError5) {
            _context6.next = 31;
            break;
          }

          throw _iteratorError5;

        case 31:
          return _context6.finish(28);

        case 32:
          return _context6.finish(25);

        case 33:
          deletePhotos(photosToDelete);

        case 34:
        case "end":
          return _context6.stop();
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
      _iteratorNormalCompletion6,
      _didIteratorError6,
      _iteratorError6,
      _iterator6,
      _step6,
      gallery,
      size,
      galleryToSync,
      _size,
      _args7 = arguments;

  return regeneratorRuntime.async(function syncGallerySizes$(_context7) {
    while (1) {
      switch (_context7.prev = _context7.next) {
        case 0:
          galleryID = _args7.length > 0 && _args7[0] !== undefined ? _args7[0] : "";

          if (!(galleryID === "")) {
            _context7.next = 35;
            break;
          }

          _context7.next = 4;
          return regeneratorRuntime.awrap(galleries.find().toArray());

        case 4:
          galleriesToSync = _context7.sent;
          _iteratorNormalCompletion6 = true;
          _didIteratorError6 = false;
          _iteratorError6 = undefined;
          _context7.prev = 8;
          _iterator6 = galleriesToSync[Symbol.iterator]();

        case 10:
          if (_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done) {
            _context7.next = 19;
            break;
          }

          gallery = _step6.value;

          if (!(gallery.photos.length > 0)) {
            _context7.next = 16;
            break;
          }

          size = calculateSizeOfGallery(gallery);
          _context7.next = 16;
          return regeneratorRuntime.awrap(galleries.updateOne({
            galleryID: gallery.galleryID
          }, {
            $set: {
              fullSizeInMB: size.fullSize,
              liteSizeInMB: size.liteSize
            }
          }));

        case 16:
          _iteratorNormalCompletion6 = true;
          _context7.next = 10;
          break;

        case 19:
          _context7.next = 25;
          break;

        case 21:
          _context7.prev = 21;
          _context7.t0 = _context7["catch"](8);
          _didIteratorError6 = true;
          _iteratorError6 = _context7.t0;

        case 25:
          _context7.prev = 25;
          _context7.prev = 26;

          if (!_iteratorNormalCompletion6 && _iterator6["return"] != null) {
            _iterator6["return"]();
          }

        case 28:
          _context7.prev = 28;

          if (!_didIteratorError6) {
            _context7.next = 31;
            break;
          }

          throw _iteratorError6;

        case 31:
          return _context7.finish(28);

        case 32:
          return _context7.finish(25);

        case 33:
          _context7.next = 41;
          break;

        case 35:
          _context7.next = 37;
          return regeneratorRuntime.awrap(galleries.findOne({
            galleryID: galleryID
          }));

        case 37:
          galleryToSync = _context7.sent;
          _size = calculateSizeOfGallery(galleryToSync);
          _context7.next = 41;
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
          return _context7.stop();
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
  var _iteratorNormalCompletion7 = true;
  var _didIteratorError7 = false;
  var _iteratorError7 = undefined;

  try {
    for (var _iterator7 = gallery.photos[Symbol.iterator](), _step7; !(_iteratorNormalCompletion7 = (_step7 = _iterator7.next()).done); _iteratorNormalCompletion7 = true) {
      var photo = _step7.value;

      if (fs.existsSync(fullPath + photo)) {
        fullSize += fs.statSync(fullPath + photo).size / 1000 / 1000;
      }

      if (fs.existsSync(litePath + photo)) {
        liteSize += fs.statSync(litePath + photo).size / 1000 / 1000;
      }
    }
  } catch (err) {
    _didIteratorError7 = true;
    _iteratorError7 = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion7 && _iterator7["return"] != null) {
        _iterator7["return"]();
      }
    } finally {
      if (_didIteratorError7) {
        throw _iteratorError7;
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
  syncGallerySizes: syncGallerySizes,
  deletePhotos: deletePhotos
};
"use strict";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var databaseHelper = require("./databaseHelpers");

var fs = require("fs");

var client = null;
var photos = null;
var tempCollection = null;
var galleries = null;
/*
initialize client
*/

function clientInitializer(clientInit) {
  client = clientInit;
  photos = client.db("eForceGallery").collection("photos");
  tempCollection = client.db("eForceGallery").collection("tempPhotos");
  galleries = client.db("eForceGallery").collection("galleries");
}
/*
returns time
*/


function getTime() {
  var now = new Date();
  return now.getHours() + ":" + now.getMinutes() + ":" + now.getSeconds();
}
/*
get today date
*/


function getToday() {
  var now = new Date();
  var month = parseInt(now.getMonth()) + 1;
  return now.getDate() + "." + month + "." + now.getFullYear();
}
/*
inserts temp photo into the database after receiving it from user
*/


function insertTempPhoto(fileName, galleryId, username, width, height, thumbnailName) {
  var tempPhoto;
  return regeneratorRuntime.async(function insertTempPhoto$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          tempPhoto = {
            fileName: fileName,
            galleryID: galleryId,
            username: username,
            width: width,
            height: height,
            thumbnail: thumbnailName,
            expirationCounter: 0
          };
          _context.next = 3;
          return regeneratorRuntime.awrap(tempCollection.insertOne(tempPhoto));

        case 3:
        case "end":
          return _context.stop();
      }
    }
  });
}
/*
returns array of temp photos matching gallery ID
*/


function getTempPhotosByGalleryId(galleryId) {
  var allTempPhotos;
  return regeneratorRuntime.async(function getTempPhotosByGalleryId$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.next = 2;
          return regeneratorRuntime.awrap(tempCollection.find({
            galleryID: galleryId
          }).toArray());

        case 2:
          allTempPhotos = _context2.sent;
          return _context2.abrupt("return", allTempPhotos);

        case 4:
        case "end":
          return _context2.stop();
      }
    }
  });
}
/*
generates ID for gallery
*/


function generateUniqueGalleryID() {
  var generate, generatedId;
  return regeneratorRuntime.async(function generateUniqueGalleryID$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          generate = function generate() {
            var chars = "0123456789abcdefghijklmnopgrstuvwxyz";
            var id = "";

            for (var i = 0; i < 32; i++) {
              id += chars[Math.floor(Math.random() * chars.length)];
            }

            return id;
          };

          generatedId = generate();

        case 2:
          _context3.next = 4;
          return regeneratorRuntime.awrap(galleries.find({
            galleryID: generatedId
          }));

        case 4:
          _context3.t0 = _context3.sent;

          if (!(_context3.t0 === null)) {
            _context3.next = 9;
            break;
          }

          generatedId = generate();
          _context3.next = 2;
          break;

        case 9:
          return _context3.abrupt("return", generatedId);

        case 10:
        case "end":
          return _context3.stop();
      }
    }
  });
}
/*
pushes new gallery with new photos to database
*/


function pushGalleryWithPhotos(tempGalleryId, galleryTitle, galleryLabel, tags, dateOfEvent, username) {
  var galleryPhotos, photoNames, newPhotos, today, time, galleryID, eventDate, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, photo, gallery, _iteratorNormalCompletion2, _didIteratorError2, _iteratorError2, _iterator2, _step2, _photo;

  return regeneratorRuntime.async(function pushGalleryWithPhotos$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.next = 2;
          return regeneratorRuntime.awrap(getTempPhotosByGalleryId(tempGalleryId));

        case 2:
          galleryPhotos = _context4.sent;
          photoNames = [];
          newPhotos = [];
          today = getToday();
          time = getTime();
          _context4.next = 9;
          return regeneratorRuntime.awrap(generateUniqueGalleryID());

        case 9:
          galleryID = _context4.sent;
          eventDate = databaseHelper.convertDateFromHTML(dateOfEvent);
          _iteratorNormalCompletion = true;
          _didIteratorError = false;
          _iteratorError = undefined;
          _context4.prev = 14;

          for (_iterator = galleryPhotos[Symbol.iterator](); !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            photo = _step.value;
            photoNames.push(photo.fileName);
          }

          _context4.next = 22;
          break;

        case 18:
          _context4.prev = 18;
          _context4.t0 = _context4["catch"](14);
          _didIteratorError = true;
          _iteratorError = _context4.t0;

        case 22:
          _context4.prev = 22;
          _context4.prev = 23;

          if (!_iteratorNormalCompletion && _iterator["return"] != null) {
            _iterator["return"]();
          }

        case 25:
          _context4.prev = 25;

          if (!_didIteratorError) {
            _context4.next = 28;
            break;
          }

          throw _iteratorError;

        case 28:
          return _context4.finish(25);

        case 29:
          return _context4.finish(22);

        case 30:
          gallery = {
            galleryID: galleryID,
            galleryTitle: galleryTitle,
            galleryLabel: galleryLabel,
            tags: tags,
            dateOfEvent: eventDate,
            nameOfContributor: username,
            lastChanges: today,
            lastChangesTime: time,
            contributionDate: today,
            photos: photoNames
          };
          _context4.next = 33;
          return regeneratorRuntime.awrap(galleries.insertOne(gallery));

        case 33:
          _iteratorNormalCompletion2 = true;
          _didIteratorError2 = false;
          _iteratorError2 = undefined;
          _context4.prev = 36;

          for (_iterator2 = galleryPhotos[Symbol.iterator](); !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
            _photo = _step2.value;
            galleryTitles = [];
            galleryTitles.push(galleryTitle);
            galleryIDs = [];
            galleryIDs.push(galleryID);
            newPhotos.push({
              galleryIDs: galleryIDs,
              galleryTitles: galleryTitles,
              tags: tags,
              dateOfContribution: today,
              dateOfEvent: eventDate,
              width: _photo.width,
              height: _photo.height,
              fileName: _photo.fileName,
              fullSizeInMB: fs.statSync(__dirname + "/../photos/uploads/" + _photo.fileName).size / 1000 / 1000,
              liteSizeInMB: -1000
            });
          }

          _context4.next = 44;
          break;

        case 40:
          _context4.prev = 40;
          _context4.t1 = _context4["catch"](36);
          _didIteratorError2 = true;
          _iteratorError2 = _context4.t1;

        case 44:
          _context4.prev = 44;
          _context4.prev = 45;

          if (!_iteratorNormalCompletion2 && _iterator2["return"] != null) {
            _iterator2["return"]();
          }

        case 47:
          _context4.prev = 47;

          if (!_didIteratorError2) {
            _context4.next = 50;
            break;
          }

          throw _iteratorError2;

        case 50:
          return _context4.finish(47);

        case 51:
          return _context4.finish(44);

        case 52:
          _context4.next = 54;
          return regeneratorRuntime.awrap(photos.insertMany(newPhotos));

        case 54:
          deleteTempPhotos(photoNames);
          setTimeout(function () {
            getLiteSizes(galleryPhotos);
          }, 5000);

        case 56:
        case "end":
          return _context4.stop();
      }
    }
  }, null, null, [[14, 18, 22, 30], [23,, 25, 29], [36, 40, 44, 52], [45,, 47, 51]]);
}

function getLiteSizes(photosToGetSize) {
  var path, newPhotoList, _iteratorNormalCompletion3, _didIteratorError3, _iteratorError3, _iterator3, _step3, photo;

  return regeneratorRuntime.async(function getLiteSizes$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          path = __dirname + "/../photos/lite-photos/";
          console.log("runs");
          newPhotoList = [];
          _iteratorNormalCompletion3 = true;
          _didIteratorError3 = false;
          _iteratorError3 = undefined;
          _context5.prev = 6;
          _iterator3 = photosToGetSize[Symbol.iterator]();

        case 8:
          if (_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done) {
            _context5.next = 19;
            break;
          }

          photo = _step3.value;

          if (!fs.existsSync(path + photo.fileName)) {
            _context5.next = 15;
            break;
          }

          _context5.next = 13;
          return regeneratorRuntime.awrap(photos.updateOne({
            fileName: photo.fileName
          }, {
            $set: {
              liteSizeInMB: fs.statSync(path + photo.fileName).size / 1000 / 1000
            }
          }));

        case 13:
          _context5.next = 16;
          break;

        case 15:
          newPhotoList.push(photo);

        case 16:
          _iteratorNormalCompletion3 = true;
          _context5.next = 8;
          break;

        case 19:
          _context5.next = 25;
          break;

        case 21:
          _context5.prev = 21;
          _context5.t0 = _context5["catch"](6);
          _didIteratorError3 = true;
          _iteratorError3 = _context5.t0;

        case 25:
          _context5.prev = 25;
          _context5.prev = 26;

          if (!_iteratorNormalCompletion3 && _iterator3["return"] != null) {
            _iterator3["return"]();
          }

        case 28:
          _context5.prev = 28;

          if (!_didIteratorError3) {
            _context5.next = 31;
            break;
          }

          throw _iteratorError3;

        case 31:
          return _context5.finish(28);

        case 32:
          return _context5.finish(25);

        case 33:
          if (newPhotoList.length !== 0) {
            setTimeout(function () {
              getLiteSizes(newPhotoList);
            }, 5000);
          }

        case 34:
        case "end":
          return _context5.stop();
      }
    }
  }, null, null, [[6, 21, 25, 33], [26,, 28, 32]]);
}
/*
deletes temp photos
*/


function deleteTempPhotos(fileNames) {
  return regeneratorRuntime.async(function deleteTempPhotos$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          _context6.next = 2;
          return regeneratorRuntime.awrap(tempCollection.deleteMany({
            fileName: {
              $in: fileNames
            }
          }));

        case 2:
        case "end":
          return _context6.stop();
      }
    }
  });
}
/*
pushes new gallery without photos to database
*/


function pushGalleryWithoutPhotos(galleryTitle, galleryLabel, tags, eventDate, username) {
  var today, time, galleryID, gallery;
  return regeneratorRuntime.async(function pushGalleryWithoutPhotos$(_context7) {
    while (1) {
      switch (_context7.prev = _context7.next) {
        case 0:
          today = getToday();
          time = getTime();
          _context7.next = 4;
          return regeneratorRuntime.awrap(generateUniqueGalleryID());

        case 4:
          galleryID = _context7.sent;
          gallery = {
            galleryID: galleryID,
            galleryTitle: galleryTitle,
            galleryLabel: galleryLabel,
            tags: tags,
            dateOfEvent: eventDate,
            nameOfContributor: username,
            lastChanges: today,
            lastChangesTime: time,
            contributionDate: today,
            photos: []
          };
          _context7.next = 8;
          return regeneratorRuntime.awrap(galleries.insertOne(gallery));

        case 8:
        case "end":
          return _context7.stop();
      }
    }
  });
}
/*
returns all galleries, which are then send to frontend
*/


function getAllGalleries() {
  var galleriesFromDatabase, galleriesToFrontEnd, _iteratorNormalCompletion4, _didIteratorError4, _iteratorError4, _iterator4, _step4, gallery, newGallery;

  return regeneratorRuntime.async(function getAllGalleries$(_context8) {
    while (1) {
      switch (_context8.prev = _context8.next) {
        case 0:
          _context8.next = 2;
          return regeneratorRuntime.awrap(galleries.find({}).toArray());

        case 2:
          galleriesFromDatabase = _context8.sent;
          galleriesToFrontEnd = [];
          _iteratorNormalCompletion4 = true;
          _didIteratorError4 = false;
          _iteratorError4 = undefined;
          _context8.prev = 7;

          for (_iterator4 = galleriesFromDatabase[Symbol.iterator](); !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
            gallery = _step4.value;
            newGallery = {
              title: gallery.galleryTitle,
              galleryID: gallery.galleryID,
              tags: gallery.tags,
              eventDate: gallery.dateOfEvent,
              contributor: gallery.nameOfContributor,
              lastChanges: gallery.lastChanges,
              label: gallery.galleryLabel,
              photos: gallery.photos.length,
              contributionDate: gallery.contributionDate
            };
            galleriesToFrontEnd.push(newGallery);
          }

          _context8.next = 15;
          break;

        case 11:
          _context8.prev = 11;
          _context8.t0 = _context8["catch"](7);
          _didIteratorError4 = true;
          _iteratorError4 = _context8.t0;

        case 15:
          _context8.prev = 15;
          _context8.prev = 16;

          if (!_iteratorNormalCompletion4 && _iterator4["return"] != null) {
            _iterator4["return"]();
          }

        case 18:
          _context8.prev = 18;

          if (!_didIteratorError4) {
            _context8.next = 21;
            break;
          }

          throw _iteratorError4;

        case 21:
          return _context8.finish(18);

        case 22:
          return _context8.finish(15);

        case 23:
          return _context8.abrupt("return", galleriesToFrontEnd);

        case 24:
        case "end":
          return _context8.stop();
      }
    }
  }, null, null, [[7, 11, 15, 23], [16,, 18, 22]]);
}
/*
clears temporary gallery periodically, here are saved photos, which are waiting for gallery to be submitted
*/


function clearTempGallery() {
  setInterval(function _callee() {
    var tempPhotos, _iteratorNormalCompletion5, _didIteratorError5, _iteratorError5, _iterator5, _step5, photo, expirationCounter;

    return regeneratorRuntime.async(function _callee$(_context9) {
      while (1) {
        switch (_context9.prev = _context9.next) {
          case 0:
            _context9.next = 2;
            return regeneratorRuntime.awrap(tempCollection.find().toArray());

          case 2:
            tempPhotos = _context9.sent;

            if (!(tempPhotos.length !== 0)) {
              _context9.next = 23;
              break;
            }

            _iteratorNormalCompletion5 = true;
            _didIteratorError5 = false;
            _iteratorError5 = undefined;
            _context9.prev = 7;

            for (_iterator5 = tempPhotos[Symbol.iterator](); !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
              photo = _step5.value;

              if (photo.expirationCounter === 20) {
                tempCollection.deleteOne({
                  fileName: photo.fileName
                });
                databaseHelper.deletePhoto(photo.fileName);
              } else {
                expirationCounter = photo.expirationCounter + 1;
                tempCollection.updateOne({
                  fileName: photo.fileName
                }, {
                  $set: {
                    expirationCounter: expirationCounter
                  }
                });
              }
            }

            _context9.next = 15;
            break;

          case 11:
            _context9.prev = 11;
            _context9.t0 = _context9["catch"](7);
            _didIteratorError5 = true;
            _iteratorError5 = _context9.t0;

          case 15:
            _context9.prev = 15;
            _context9.prev = 16;

            if (!_iteratorNormalCompletion5 && _iterator5["return"] != null) {
              _iterator5["return"]();
            }

          case 18:
            _context9.prev = 18;

            if (!_didIteratorError5) {
              _context9.next = 21;
              break;
            }

            throw _iteratorError5;

          case 21:
            return _context9.finish(18);

          case 22:
            return _context9.finish(15);

          case 23:
          case "end":
            return _context9.stop();
        }
      }
    }, null, null, [[7, 11, 15, 23], [16,, 18, 22]]);
  }, 1000 * 60 * 60);
}
/*
finds gallery by id
*/


function findGalleryByID(galleryID) {
  var gallery;
  return regeneratorRuntime.async(function findGalleryByID$(_context10) {
    while (1) {
      switch (_context10.prev = _context10.next) {
        case 0:
          _context10.next = 2;
          return regeneratorRuntime.awrap(galleries.findOne({
            galleryID: galleryID
          }));

        case 2:
          gallery = _context10.sent;
          return _context10.abrupt("return", gallery);

        case 4:
        case "end":
          return _context10.stop();
      }
    }
  });
}

module.exports = _objectSpread({
  clientInitializer: clientInitializer,
  insertTempPhoto: insertTempPhoto,
  pushGalleryWithPhotos: pushGalleryWithPhotos,
  pushGalleryWithoutPhotos: pushGalleryWithoutPhotos,
  getAllGalleries: getAllGalleries,
  clearTempGallery: clearTempGallery,
  findGalleryByID: findGalleryByID
}, require("./galleryModifier"), {}, require("./photoGetters"));
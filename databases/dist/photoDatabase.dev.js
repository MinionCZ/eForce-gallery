"use strict";

var mongoClient = require("mongodb");

var databaseHelper = require("./databaseHelpers");

var client = null;
var collection = null;
var tempCollection = null;
var galleries = null;

var fs = require("fs");

function clientInitializer(clientInit) {
  client = clientInit;
  collection = client.db("eForceGallery").collection("photos");
  tempCollection = client.db("eForceGallery").collection("tempPhotos");
  galleries = client.db("eForceGallery").collection("galleries");
}

function getTime() {
  var now = new Date();
  return now.getHours() + ":" + now.getMinutes() + ":" + now.getSeconds();
}

function getToday() {
  var now = new Date();
  var month = parseInt(now.getMonth()) + 1;
  return now.getDate() + "." + month + "." + now.getFullYear();
}

function getExpirationTime() {
  var now = new Date();
  var hours = now.getHours() + 10;

  if (now.getHours() + 10 > 24) {
    hours = (now.getHours() + 10) % 24;
  }

  return hours + ":" + now.getMinutes() + ":" + now.getSeconds();
}

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
            newPhotos.push({
              galleryID: galleryID,
              galleryTitle: galleryTitle,
              tags: tags,
              dateOfChange: today,
              dateOfEvent: eventDate,
              width: _photo.width,
              height: _photo.height,
              fileName: _photo.fileName
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
          return regeneratorRuntime.awrap(collection.insertMany(newPhotos));

        case 54:
          deleteTempPhotos(photoNames);

        case 55:
        case "end":
          return _context4.stop();
      }
    }
  }, null, null, [[14, 18, 22, 30], [23,, 25, 29], [36, 40, 44, 52], [45,, 47, 51]]);
}

function deleteTempPhotos(fileNames) {
  return regeneratorRuntime.async(function deleteTempPhotos$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          _context5.next = 2;
          return regeneratorRuntime.awrap(tempCollection.deleteMany({
            fileName: {
              $in: fileNames
            }
          }));

        case 2:
        case "end":
          return _context5.stop();
      }
    }
  });
}

function pushGalleryWithoutPhotos(galleryTitle, galleryLabel, tags, eventDate, username) {
  var today, time, galleryID, gallery;
  return regeneratorRuntime.async(function pushGalleryWithoutPhotos$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          today = getToday();
          time = getTime();
          _context6.next = 4;
          return regeneratorRuntime.awrap(generateUniqueGalleryID());

        case 4:
          galleryID = _context6.sent;
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
          _context6.next = 8;
          return regeneratorRuntime.awrap(galleries.insertOne(gallery));

        case 8:
        case "end":
          return _context6.stop();
      }
    }
  });
}

function getAllGalleries() {
  var galleriesFromDatabase, galleriesToFrontEnd, _iteratorNormalCompletion3, _didIteratorError3, _iteratorError3, _iterator3, _step3, gallery, newGallery;

  return regeneratorRuntime.async(function getAllGalleries$(_context7) {
    while (1) {
      switch (_context7.prev = _context7.next) {
        case 0:
          _context7.next = 2;
          return regeneratorRuntime.awrap(galleries.find().toArray());

        case 2:
          galleriesFromDatabase = _context7.sent;
          galleriesToFrontEnd = [];
          _iteratorNormalCompletion3 = true;
          _didIteratorError3 = false;
          _iteratorError3 = undefined;
          _context7.prev = 7;

          for (_iterator3 = galleriesFromDatabase[Symbol.iterator](); !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
            gallery = _step3.value;
            newGallery = {
              title: gallery.galleryTitle,
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

          _context7.next = 15;
          break;

        case 11:
          _context7.prev = 11;
          _context7.t0 = _context7["catch"](7);
          _didIteratorError3 = true;
          _iteratorError3 = _context7.t0;

        case 15:
          _context7.prev = 15;
          _context7.prev = 16;

          if (!_iteratorNormalCompletion3 && _iterator3["return"] != null) {
            _iterator3["return"]();
          }

        case 18:
          _context7.prev = 18;

          if (!_didIteratorError3) {
            _context7.next = 21;
            break;
          }

          throw _iteratorError3;

        case 21:
          return _context7.finish(18);

        case 22:
          return _context7.finish(15);

        case 23:
          return _context7.abrupt("return", galleriesToFrontEnd);

        case 24:
        case "end":
          return _context7.stop();
      }
    }
  }, null, null, [[7, 11, 15, 23], [16,, 18, 22]]);
}

function clearTempGallery() {
  setInterval(function _callee() {
    var tempPhotos, _iteratorNormalCompletion4, _didIteratorError4, _iteratorError4, _iterator4, _step4, photo, expirationCounter;

    return regeneratorRuntime.async(function _callee$(_context8) {
      while (1) {
        switch (_context8.prev = _context8.next) {
          case 0:
            _context8.next = 2;
            return regeneratorRuntime.awrap(tempCollection.find().toArray());

          case 2:
            tempPhotos = _context8.sent;

            if (!(tempPhotos.length !== 0)) {
              _context8.next = 23;
              break;
            }

            _iteratorNormalCompletion4 = true;
            _didIteratorError4 = false;
            _iteratorError4 = undefined;
            _context8.prev = 7;

            for (_iterator4 = tempPhotos[Symbol.iterator](); !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
              photo = _step4.value;

              if (photo.expirationCounter === 20) {
                tempCollection.deleteOne({
                  fileName: photo.fileName
                });
                fs.unlinkSync("./photos/uploads/" + photo.fileName);
                console.log(photo.fileName);
                fs.unlinkSync("./photos/thumbnails/" + getThumbnailFromFileName(photo.fileName));
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
          case "end":
            return _context8.stop();
        }
      }
    }, null, null, [[7, 11, 15, 23], [16,, 18, 22]]);
  }, 1000 * 60 * 60);
}

function getThumbnailFromFileName(fileName) {
  var filenames = fileName.split(".");
  return filenames[0] + "-th." + filenames[1];
}

module.exports = {
  clientInitializer: clientInitializer,
  insertTempPhoto: insertTempPhoto,
  pushGalleryWithPhotos: pushGalleryWithPhotos,
  pushGalleryWithoutPhotos: pushGalleryWithoutPhotos,
  getAllGalleries: getAllGalleries,
  clearTempGallery: clearTempGallery
};
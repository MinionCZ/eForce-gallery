"use strict";

var databaseHelper = require("./databaseHelpers");

var photos = null;
var galleries = null;
/*
initialize client
*/

function initPhotoGetters(clientInit) {
  photos = clientInit.db("eForceGallery").collection("photos");
  galleries = clientInit.db("eForceGallery").collection("galleries");
}
/*
return array of photos by page and count of photos on this page, this is from unfiltered photos collection
*/


function getUnfilteredPhotos(page, photosPerPage) {
  var allPhotos;
  return regeneratorRuntime.async(function getUnfilteredPhotos$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return regeneratorRuntime.awrap(photos.find().toArray());

        case 2:
          allPhotos = _context.sent;
          return _context.abrupt("return", getPhotosToPage(page, photosPerPage, allPhotos));

        case 4:
        case "end":
          return _context.stop();
      }
    }
  });
}
/*
adds additional information for front end currently only maximum of photos
*/


function addWrapperToResponse(count, photos, fullSize, liteSize) {
  return {
    photosCount: count,
    photos: photos,
    fullSize: fullSize,
    liteSize: liteSize
  };
}
/*
returns exact photos for current page
*/


function getPhotosToPage(page, photosPerPage, photos) {
  var photosToReturn = [];

  if (photos.length >= page * photosPerPage) {
    for (var i = (page - 1) * photosPerPage; i < page * photosPerPage; i++) {
      photosToReturn.push(photos[i]);
    }
  } else if (photos.length >= (page - 1) * photosPerPage) {
    for (var _i = page - 1; _i < photos.length; _i++) {
      photosToReturn.push(photos[_i]);
    }
  }

  var size = calculateSizeOfPhotoArray(photos);
  return addWrapperToResponse(photos.length, photosToReturn, size.fullSize, size.liteSize);
}
/*
this function filters photos by tags, serves as main function for photos service to front end
*/


function filterPhotosByTags(tags, page, photosPerPage) {
  var tagLessPhotos, multipleTags;
  return regeneratorRuntime.async(function filterPhotosByTags$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          if (!(tags.length == 0)) {
            _context2.next = 4;
            break;
          }

          _context2.next = 3;
          return regeneratorRuntime.awrap(getUnfilteredPhotos(page, photosPerPage));

        case 3:
          return _context2.abrupt("return", _context2.sent);

        case 4:
          if (!(tags.length === 1 && tags[0] === "#without-tags-photos")) {
            _context2.next = 9;
            break;
          }

          _context2.next = 7;
          return regeneratorRuntime.awrap(photos.find({
            tags: {
              $exists: true,
              $size: 0
            }
          }).toArray());

        case 7:
          tagLessPhotos = _context2.sent;
          return _context2.abrupt("return", getPhotosToPage(page, photosPerPage, tagLessPhotos));

        case 9:
          multipleTags = photos.find({
            tags: {
              $exists: true,
              $all: tags
            }
          });
          return _context2.abrupt("return", getPhotosToPage(page, photosPerPage, multipleTags));

        case 11:
        case "end":
          return _context2.stop();
      }
    }
  });
}
/*
calculates size of files on HDD and sends them to front end
*/


function calculateSizeOfPhotoArray(photos) {
  var liteSize = 0,
      fullSize = 0;
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = photos[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var photo = _step.value;
      liteSize += photo.liteSizeInMB;
      fullSize += photo.fullSizeInMB;
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator["return"] != null) {
        _iterator["return"]();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }

  return {
    liteSize: liteSize,
    fullSize: fullSize
  };
}
/*
returns all photos, possible argument to exclude some of them
second possible argument says if function returns all photos or, just their filenames
*/


function getAllPhotos() {
  var excludedFilenames,
      onlyFileNames,
      allPhotos,
      _args3 = arguments;
  return regeneratorRuntime.async(function getAllPhotos$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          excludedFilenames = _args3.length > 0 && _args3[0] !== undefined ? _args3[0] : [];
          onlyFileNames = _args3.length > 1 && _args3[1] !== undefined ? _args3[1] : false;
          _context3.next = 4;
          return regeneratorRuntime.awrap(photos.find({}).toArray());

        case 4:
          allPhotos = _context3.sent;

          if (!(excludedFilenames.length === 0)) {
            _context3.next = 11;
            break;
          }

          if (!onlyFileNames) {
            _context3.next = 8;
            break;
          }

          return _context3.abrupt("return", getFileNamesFromPhotos(allPhotos));

        case 8:
          return _context3.abrupt("return", allPhotos);

        case 11:
          return _context3.abrupt("return", getExcludedPhotos(allPhotos, excludedFilenames, onlyFileNames));

        case 12:
        case "end":
          return _context3.stop();
      }
    }
  });
}
/*
returns file of filenames from array of photo objects
*/


function getFileNamesFromPhotos(photos) {
  var photosToReturn = [];
  var _iteratorNormalCompletion2 = true;
  var _didIteratorError2 = false;
  var _iteratorError2 = undefined;

  try {
    for (var _iterator2 = photos[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
      var photo = _step2.value;
      photosToReturn.push(photo.fileName);
    }
  } catch (err) {
    _didIteratorError2 = true;
    _iteratorError2 = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion2 && _iterator2["return"] != null) {
        _iterator2["return"]();
      }
    } finally {
      if (_didIteratorError2) {
        throw _iteratorError2;
      }
    }
  }

  return photosToReturn;
}
/*
returns array of photos without excluded ones, can return only filenames
 */


function getExcludedPhotos(photos, excludedFilenames) {
  var onlyFileNames = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
  var photosToReturn = [];
  var excludedSet = new Set(excludedFilenames);
  var _iteratorNormalCompletion3 = true;
  var _didIteratorError3 = false;
  var _iteratorError3 = undefined;

  try {
    for (var _iterator3 = photos[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
      var photo = _step3.value;

      if (!excludedSet.has(photo.fileName)) {
        if (onlyFileNames) {
          photosToReturn.push(photo.fileName);
        } else {
          photosToReturn.push(photo);
        }
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

  return photosToReturn;
}

module.exports = {
  initPhotoGetters: initPhotoGetters,
  filterPhotosByTags: filterPhotosByTags,
  getAllPhotos: getAllPhotos
};
"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var fs = require("fs");

var charMap = new Map();

function convertDateFromHTML(date) {
  var datePieces = date.split("-");
  return datePieces[2] + "." + datePieces[1] + "." + datePieces[0];
}

function convertDateToHTML(date) {
  var datePieces = date.split(".");
  return datePieces[2] + "-" + datePieces[1] + "-" + datePieces[0];
}

function getThumbnailFromFileName(fileName) {
  var filenames = fileName.split(".");
  return filenames[0] + "-th." + filenames[1];
}

function deletePhoto(photoName) {
  if (_typeof(photoName) === Object) {
    photoName = photoName.fileName;
  }

  console.log(photoName);
  fs.unlinkSync("./photos/uploads/" + photoName);
  fs.unlinkSync("./photos/thumbnails/" + getThumbnailFromFileName(photoName));
  fs.unlinkSync("./photos/lite-photos/" + photoName);
  fs.unlinkSync("./photos/big-thumbnails/" + getThumbnailFromFileName(photoName));
}

function deleteManyPhotos(photos) {
  var _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, photo;

  return regeneratorRuntime.async(function deleteManyPhotos$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _iteratorNormalCompletion = true;
          _didIteratorError = false;
          _iteratorError = undefined;
          _context.prev = 3;

          for (_iterator = photos[Symbol.iterator](); !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            photo = _step.value;
            deletePhoto(photo);
          }

          _context.next = 11;
          break;

        case 7:
          _context.prev = 7;
          _context.t0 = _context["catch"](3);
          _didIteratorError = true;
          _iteratorError = _context.t0;

        case 11:
          _context.prev = 11;
          _context.prev = 12;

          if (!_iteratorNormalCompletion && _iterator["return"] != null) {
            _iterator["return"]();
          }

        case 14:
          _context.prev = 14;

          if (!_didIteratorError) {
            _context.next = 17;
            break;
          }

          throw _iteratorError;

        case 17:
          return _context.finish(14);

        case 18:
          return _context.finish(11);

        case 19:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[3, 7, 11, 19], [12,, 14, 18]]);
}

function addStringToFileName(filename, string) {
  var splittedFilename = filename.split(".");
  splittedFilename[0] += string;
  return splittedFilename[0] + "." + splittedFilename[1];
}
/*
returns string with only english chars
*/


function stringToEnglish(string) {
  fillCharMap();
  var newString = "";
  var _iteratorNormalCompletion2 = true;
  var _didIteratorError2 = false;
  var _iteratorError2 = undefined;

  try {
    for (var _iterator2 = string[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
      var _char = _step2.value;

      if (charMap.has(_char)) {
        newString += charMap.get(_char);
      } else {
        newString += _char;
      }
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

  return newString;
}
/*
fills char map with czech and english chars if it is empty, else just ends
*/


function fillCharMap() {
  if (charMap.size === 0) {
    var czechChars = "ÁáČčĎďĚěÉéÍíŇňÓóŘřŠšŤťÚúůÝýŽž";
    var enChars = "AaCcDdEeEeIiNnOoRrSsTtUuYyZz";

    for (var i = 0; i < enChars.length; i++) {
      charMap.set(czechChars[i], enChars[i]);
    }
  }
}

module.exports = {
  convertDateToHTML: convertDateToHTML,
  convertDateFromHTML: convertDateFromHTML,
  deletePhoto: deletePhoto,
  getThumbnailFromFileName: getThumbnailFromFileName,
  deleteManyPhotos: deleteManyPhotos,
  addStringToFileName: addStringToFileName,
  stringToEnglish: stringToEnglish
};
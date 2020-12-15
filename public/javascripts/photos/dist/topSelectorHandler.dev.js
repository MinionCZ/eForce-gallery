"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setMaxPage = setMaxPage;
exports.initTopSelector = initTopSelector;

var _photosStore = require("./photosStore.js");

var _checkStore = require("./checkStore.js");

function setMaxPage(photos) {
  var pages = Math.floor(photos / 60);

  if (photos % 60 > 0) {
    pages++;
  }

  document.getElementById("maxPages").innerHTML = "/" + pages;
}

function selectAllOnPage() {
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = _photosStore.PhotosStore.photos[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var photo = _step.value;

      _checkStore.CheckStore.addCheckedPhoto(photo.fileName);

      photo.checkBox.checked = true;
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
}

function initTopSelector() {
  document.getElementById("selectAllPhotosOnPage").addEventListener("click", selectAllOnPage);
}
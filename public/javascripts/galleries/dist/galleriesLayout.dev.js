"use strict";

var _gallery = require("./gallery.js");

var _galleryStore = require("./galleryStore.js");

var _gallerySort = require("./gallerySort.js");

var galleries = [];

function createLayout(galleries) {
  console.log(galleries);
  fetchGalleriesInfo();
}

function fetchGalleriesInfo() {
  _galleryStore.GalleryStore.fetchTagColors();

  var request = new XMLHttpRequest();
  request.addEventListener("load", handleGalleryInformation);
  request.open("GET", "/eforce-gallery/galleries/get-all");
  request.send();
}

fetchGalleriesInfo();

function handleGalleryInformation() {
  var galleriesInfo = JSON.parse(this.responseText);
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = galleriesInfo[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var gal = _step.value;

      _galleryStore.GalleryStore.addGallery(new _gallery.Gallery(gal));
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

  _gallerySort.GallerySort.handleQueryChange();
}

function handleSortAndSearch() {
  _gallerySort.GallerySort.handleQueryChange();
}

function handleQueryCancel() {
  _gallerySort.GallerySort.cancelQuery();
}

window.onload = function () {
  document.getElementById("mainSort").addEventListener("change", handleSortAndSearch);
  document.getElementById("sortAscDesc").addEventListener("change", handleSortAndSearch);
  document.getElementById("searchBar").addEventListener("input", handleSortAndSearch);
  document.getElementById("cancelQueryButton").addEventListener("click", handleQueryCancel);
};
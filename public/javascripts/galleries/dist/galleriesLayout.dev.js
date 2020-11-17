"use strict";

var _gallery = require("./gallery.js");

var _galleryStore = require("./galleryStore.js");

var _galleryRender = require("./galleryRender.js");

var galleries = [];

function createLayout(galleries) {
  console.log(galleries);
  fetchGalleriesInfo();
}

function fetchGalleriesInfo() {
  var request = new XMLHttpRequest();
  request.addEventListener("load", handleGalleryInformation);
  request.open("GET", "/galleries/get-all");
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

  _galleryStore.GalleryStore.sortGalleries();

  _galleryRender.GalleryRender.renderGalleries(_galleryStore.GalleryStore.getAllGalleries());
}

function handleSortAndSearch() {
  var mainSort = document.getElementById("mainSort").value;
  var secondSort = document.getElementById("sortAscDesc").value;
  var asc = true;

  if (secondSort === "desc") {
    asc = false;
  }

  _galleryStore.GalleryStore.sortGalleries(mainSort, asc);

  var sortString = document.getElementById("searchBar").value;

  if (sortString === "") {
    _galleryRender.GalleryRender.renderGalleries(_galleryStore.GalleryStore.getAllGalleries());
  } else {
    var foundGalleries = _galleryStore.GalleryStore.findGalleries(sortString);

    _galleryRender.GalleryRender.renderGalleries(foundGalleries);
  }
}

window.onload = function () {
  document.getElementById("mainSort").addEventListener("change", handleSortAndSearch);
  document.getElementById("sortAscDesc").addEventListener("change", handleSortAndSearch);
  document.getElementById("searchBar").addEventListener("input", handleSortAndSearch);
};
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.initTopSelector = initTopSelector;
exports.topButtonsDisable = topButtonsDisable;
exports.isPageSelected = isPageSelected;

var _photosStore = require("./photosStore.js");

var _checkStore = require("./checkStore.js");

var _layoutGenerator = require("./layoutGenerator.js");

var _pageHandler = require("./pageHandler.js");

var selectedPages = new Set();
/*
handles button that selects all photos on page, works iff not all photos are selected
*/

function selectAllOnPage() {
  if (_checkStore.CheckStore.allSelected) {
    return;
  }

  if (!selectedPages.has((0, _pageHandler.getPage)())) {
    document.getElementById("selectAllPhotosOnPage").textContent = "Deselect all on page";
    selectedPages.add((0, _pageHandler.getPage)());
  } else {
    document.getElementById("selectAllPhotosOnPage").textContent = "Select all on page";
    selectedPages["delete"]((0, _pageHandler.getPage)());
  }

  _photosStore.PhotosStore.setStateOfAllPhotos(selectedPages.has((0, _pageHandler.getPage)()));
}
/*
selects all photos
*/


function selectAll() {
  if (_checkStore.CheckStore.allSelected) {
    document.getElementById("selectAllPhotos").textContent = "Select all";
  } else {
    document.getElementById("selectAllPhotos").textContent = "Deselect all";
    document.getElementById("selectAllPhotosOnPage").textContent = "Select all on page";
  }

  _checkStore.CheckStore.toggleAllSelected();
}
/*
handles download options
creates div with 2 buttons to select which version user wants to download
*/


function handleDownload() {
  var selectedPhotos = _checkStore.CheckStore.getSelectedPhotos();

  var size = _photosStore.PhotosStore.sumPhotosSize(selectedPhotos.photos, selectedPhotos.allSelected);

  (0, _layoutGenerator.buildDownloadLayout)(selectedPhotos, size);
}

function handleDelete() {
  var selectedPhotos = _checkStore.CheckStore.getSelectedPhotos();

  var photosCount = _photosStore.PhotosStore.photosCount;
  var photosToDeleteCount = 0;

  if (selectedPhotos.allSelected) {
    photosToDeleteCount = photosCount - selectedPhotos.photos.length;
  } else {
    photosToDeleteCount = selectedPhotos.photos.length;
  }

  (0, _layoutGenerator.buildDeleteLayout)(photosToDeleteCount, selectedPhotos);
}
/*
init all buttons on top selector, it is called from mainPhotoPage, where is it called after window is loaded
*/


function initTopSelector() {
  document.getElementById("selectAllPhotosOnPage").addEventListener("click", selectAllOnPage);
  document.getElementById("selectAllPhotos").addEventListener("click", selectAll);
  document.getElementById("downloadButton").addEventListener("click", handleDownload);
  document.getElementById("incrementPageButton").addEventListener("click", _pageHandler.incrementHandler);
  document.getElementById("decrementPageButton").addEventListener("click", _pageHandler.decrementHandler);
  document.getElementById("pageInput").addEventListener("keydown", _pageHandler.handleWritePage);
  document.getElementById("deleteButton").addEventListener("click", handleDelete);
}
/*
disables and enables buttons: download selected, delete selected and add selected to gallery, preventing using when is nothing selected
can be called without argument to disable
*/


function topButtonsDisable() {
  var status = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
  document.getElementById("downloadButton").disabled = status;
  document.getElementById("deleteButton").disabled = status;
  document.getElementById("addToGalleryButton").disabled = status;
}

function isPageSelected(page) {
  return selectedPages.has(page);
}
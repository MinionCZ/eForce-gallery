"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setMaxPage = setMaxPage;
exports.initTopSelector = initTopSelector;
exports.topButtonsDisable = topButtonsDisable;

var _photosStore = require("./photosStore.js");

var _checkStore = require("./checkStore.js");

var _layoutGenerator = require("./layoutGenerator.js");

var selectAllOnPageClicked = false;

function setMaxPage(photos) {
  var pages = Math.floor(photos / 60);

  if (photos % 60 > 0) {
    pages++;
  }

  document.getElementById("maxPages").innerHTML = "/" + pages;
}
/*
handles button that selects all photos on page, works iff not all photos are selected
*/


function selectAllOnPage() {
  if (_checkStore.CheckStore.allSelected) {
    return;
  }

  if (!selectAllOnPageClicked) {
    document.getElementById("selectAllPhotosOnPage").textContent = "Deselect all on page";
  } else {
    document.getElementById("selectAllPhotosOnPage").textContent = "Select all on page";
  }

  selectAllOnPageClicked = !selectAllOnPageClicked;

  _photosStore.PhotosStore.setStateOfAllPhotos(selectAllOnPageClicked);
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
    selectAllOnPageClicked = false;
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
/*
init all buttons on top selector, it is called from mainPhotoPage, where is it called after window is loaded
*/


function initTopSelector() {
  document.getElementById("selectAllPhotosOnPage").addEventListener("click", selectAllOnPage);
  document.getElementById("selectAllPhotos").addEventListener("click", selectAll);
  document.getElementById("downloadButton").addEventListener("click", handleDownload);
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
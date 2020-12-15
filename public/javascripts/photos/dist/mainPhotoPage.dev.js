"use strict";

var _photosStore = require("./photosStore.js");

var _sideBars = require("./sideBars.js");

var _topSelectorHandler = require("./topSelectorHandler.js");

window.onload = function () {
  document.getElementById("tagsToggleLeft").addEventListener("click", _sideBars.toggleSideBar);
  document.getElementById("tagsToggleRight").addEventListener("click", _sideBars.toggleSideBar);
  document.getElementById("closeGalleries").addEventListener("click", _sideBars.toggleSideBar);
  document.getElementById("closeTags").addEventListener("click", _sideBars.toggleSideBar);
  (0, _topSelectorHandler.initTopSelector)();

  _photosStore.PhotosStore.fetchPage(1);
};
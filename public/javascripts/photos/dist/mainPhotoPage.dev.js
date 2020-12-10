"use strict";

var _photosStore = require("./photosStore.js");

window.onload = function () {
  _photosStore.PhotosStore.fetchPage(1, 40);
};
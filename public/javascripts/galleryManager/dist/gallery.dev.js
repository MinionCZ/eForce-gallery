"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Gallery = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Gallery = function Gallery(dataInJson) {
  _classCallCheck(this, Gallery);

  this.title = dataInJson.galleryTitle;
  this.galleryID = dataInJson.galleryID;
  this.liteSize = dataInJson.liteSizeInMB;
  this.fullSize = dataInJson.fullSizeInMB;
  this.label = dataInJson.galleryLabel;
  this.eventDate = dataInJson.dateOfEvent;
  this.contributor = dataInJson.nameOfContributor;
  this.contributionDate = dataInJson.contributionDate;
  this.lastChanges = dataInJson.lastChanges;
  this.lastChangesTime = dataInJson.lastChangesTime;
  this.photos = dataInJson.photos;
};

exports.Gallery = Gallery;
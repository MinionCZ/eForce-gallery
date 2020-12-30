"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Photo = void 0;

var _checkStore = require("./checkStore.js");

var _photosStore = require("./photosStore.js");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Photo =
/*#__PURE__*/
function () {
  function Photo(jsonObject) {
    _classCallCheck(this, Photo);

    this.fileName = jsonObject.fileName;
    this.width = jsonObject.width;
    this.height = jsonObject.height;
    this.tags = jsonObject.tags;
    this.galleries = jsonObject.galleryTitles;
    this.contributionDate = jsonObject.dateOfContribution;
    this.checkBox = null;
    this.fullSize = jsonObject.fullSizeInMB;
    this.liteSize = jsonObject.liteSizeInMB;
  }

  _createClass(Photo, [{
    key: "getDivForRender",
    value: function getDivForRender() {
      var root = document.createElement("div");
      root.setAttribute("id", "photoDiv");
      root.setAttribute("class", "photo-div");
      var picture = document.createElement("img");
      picture.setAttribute("src", this.getImageLink(true));
      picture.setAttribute("class", "thumbnail");
      picture.setAttribute("width", "420px");
      picture.setAttribute("height", "280px");
      var checkBox = document.createElement("input");
      checkBox.setAttribute("type", "checkbox");
      checkBox.setAttribute("class", "photo-checkbox");
      checkBox.setAttribute("value", this.fileName);
      checkBox.checked = _checkStore.CheckStore.isPhotoChecked(this.fileName);
      checkBox.addEventListener("change", this.changeClickState);
      root.appendChild(picture);
      root.appendChild(checkBox);
      this.checkBox = checkBox;
      return root;
    }
  }, {
    key: "getImageLink",
    value: function getImageLink() {
      var thumbnail = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
      return "/photos/fetch-photo-by-id?fileName=" + this.fileName + "&thumbnail=" + thumbnail;
    }
  }, {
    key: "changeClickState",
    value: function changeClickState() {
      if (this.checked) {
        _checkStore.CheckStore.addCheckedPhoto(this.value);
      } else {
        _checkStore.CheckStore.removeCheckedPhoto(this.value);
      }
    }
  }]);

  return Photo;
}();

exports.Photo = Photo;
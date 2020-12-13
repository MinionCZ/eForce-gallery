"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Photo = void 0;

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
      root.appendChild(picture);
      return root;
    }
  }, {
    key: "getImageLink",
    value: function getImageLink() {
      var thumbnail = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
      return "/photos/fetch-photo-by-id?fileName=" + this.fileName + "&thumbnail=" + thumbnail;
    }
  }]);

  return Photo;
}();

exports.Photo = Photo;
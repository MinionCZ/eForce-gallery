"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PhotoPreview = void 0;

var _photoPreviewGenerator = require("./photoPreviewGenerator.js");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var PhotoPreview =
/*#__PURE__*/
function () {
  function PhotoPreview(photo, lastCallback, nextCallback, indexOnPage) {
    _classCallCheck(this, PhotoPreview);

    this.indexOnPage = indexOnPage;
    this.photo = photo;
    this.rootElement = (0, _photoPreviewGenerator.generateRootElement)();
    this.sideButtons = (0, _photoPreviewGenerator.generateSideButtons)(lastCallback, nextCallback);
    this.rootElement.appendChild(this.sideButtons.leftButton);
    this.rootElement.appendChild(this.sideButtons.rightButton);
    this.rootElement.appendChild((0, _photoPreviewGenerator.generateTopLine)(photo.fileName, this.downloadPhoto, this.deletePhoto, this.rootElement));
    this.rootElement.appendChild((0, _photoPreviewGenerator.generateCheckBox)(photo));
    this.rootElement.appendChild((0, _photoPreviewGenerator.generatePhotoView)(photo.getImageLink(false)));
    document.body.appendChild(this.rootElement);
  }
  /*
  downloads current photo
  */


  _createClass(PhotoPreview, [{
    key: "downloadPhoto",
    value: function downloadPhoto(filename, version) {
      var a;
      return regeneratorRuntime.async(function downloadPhoto$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              a = document.createElement("a");
              a.href = window.location.origin + "/photos/download-one?version=" + version + "&" + "filename=" + filename;
              a.click();

            case 3:
            case "end":
              return _context.stop();
          }
        }
      });
    }
    /*
    deletes photo which is currently selected
    */

  }, {
    key: "deletePhoto",
    value: function deletePhoto(filename) {
      console.log(this.indexOnPage);
    }
    /*
    returns index
    */

  }, {
    key: "getIndex",
    value: function getIndex() {
      return this.indexOnPage;
    }
    /*
    sets photo to preview
    */

  }, {
    key: "setPhotoToPreview",
    value: function setPhotoToPreview(photo, isPreviousPhoto, isNextPhoto) {
      this.photo = photo;
      (0, _photoPreviewGenerator.setPhotoToPreview)(photo);
      document.getElementById("leftSideButton").disabled = !isPreviousPhoto;
      document.getElementById("rightSideButton").disabled = !isNextPhoto;
    }
    /*
    sets index
    */

  }, {
    key: "setIndex",
    value: function setIndex(index) {
      this.indexOnPage = index;
    }
  }]);

  return PhotoPreview;
}();

exports.PhotoPreview = PhotoPreview;
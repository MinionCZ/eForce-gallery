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
      return regeneratorRuntime.async(function downloadPhoto$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              console.log(filename, version);

            case 1:
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
      return regeneratorRuntime.async(function deletePhoto$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              console.log(filename);

            case 1:
            case "end":
              return _context2.stop();
          }
        }
      });
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
    increments index of photo on page
    */

  }, {
    key: "incrementIndex",
    value: function incrementIndex(increment) {
      if (increment) {
        this.indexOnPage++;
      } else {
        this.indexOnPage--;
      }
    }
  }, {
    key: "setPhotoToPreview",
    value: function setPhotoToPreview(photo) {
      this.photo = photo;
      (0, _photoPreviewGenerator.setPhotoToPreview)(photo);
    }
  }]);

  return PhotoPreview;
}();

exports.PhotoPreview = PhotoPreview;
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
  function PhotoPreview(filename, lastCallback, nextCallback, indexOnPage) {
    _classCallCheck(this, PhotoPreview);

    this.indexOnPage = indexOnPage;
    this.filename = filename;
    this.rootElement = (0, _photoPreviewGenerator.generateRootElement)();
    this.sideButtons = (0, _photoPreviewGenerator.generateSideButtons)(lastCallback, nextCallback);
    this.rootElement.appendChild(this.sideButtons.leftButton);
    this.rootElement.appendChild(this.sideButtons.rightButton);
    this.rootElement.appendChild((0, _photoPreviewGenerator.generateTopLine)(filename, this.downloadPhoto, this.deletePhoto, this.rootElement));
    document.body.appendChild(this.rootElement);
  }

  _createClass(PhotoPreview, [{
    key: "downloadPhoto",
    value: function downloadPhoto(version) {
      return regeneratorRuntime.async(function downloadPhoto$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              console.log(this.filename, version);

            case 1:
            case "end":
              return _context.stop();
          }
        }
      }, null, this);
    }
  }, {
    key: "deletePhoto",
    value: function deletePhoto() {
      return regeneratorRuntime.async(function deletePhoto$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              console.log(this.filename);

            case 1:
            case "end":
              return _context2.stop();
          }
        }
      }, null, this);
    }
  }, {
    key: "getIndex",
    value: function getIndex() {
      return this.indexOnPage;
    }
  }, {
    key: "incrementIndex",
    value: function incrementIndex(increment) {
      if (increment) {
        this.indexOnPage++;
      } else {
        this.indexOnPage--;
      }
    }
  }]);

  return PhotoPreview;
}();

exports.PhotoPreview = PhotoPreview;
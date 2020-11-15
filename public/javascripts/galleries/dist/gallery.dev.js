"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Gallery = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Gallery =
/*#__PURE__*/
function () {
  function Gallery(gallery) {
    _classCallCheck(this, Gallery);

    this.title = gallery.title;
    this.tags = gallery.tags;
    this.eventDate = gallery.eventDate;
    this.contributionDate = gallery.contributionDate;
    this.changeDate = gallery.changeDate;
    this.photosCount = gallery.photosCount;
    this.contributor = gallery.contributor;
    this.lastChanges = gallery.lastChanges;
    this.label = gallery.label;
    this.fetchPhoto();
    this.searchWords = this.generateSearchWords();
    this.isRendered = true;
  }

  _createClass(Gallery, [{
    key: "generateSearchWords",
    value: function generateSearchWords() {
      var words = [];
      words.push(this.title);
      words.push(this.eventDate);
      words.push(this.contributionDate);
      words.push(this.contributor);
      words = words.concat(this.tags);
      words = words.concat(this.splitLabel(this.label));
      return words;
    }
  }, {
    key: "splitLabel",
    value: function splitLabel(label) {
      var words = [];
      var word = "";
      var splits = ",. (){}[];?!";
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = label[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var _char = _step.value;

          if (splits.includes(_char)) {
            if (word.length > 0) {
              words.push(word.toLowerCase());
            }

            word = "";
          } else {
            word += _char;
          }
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator["return"] != null) {
            _iterator["return"]();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }

      if (word.length > 0) {
        words.push(word);
      }

      return words;
    }
  }, {
    key: "fetchPhoto",
    value: function fetchPhoto() {
      var _this = this;

      var request = new XMLHttpRequest();
      var params = JSON.stringify({
        galleryTitle: this.title
      });
      request.open("POST", "/photo-gallery/get-photo", true);
      request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
      request.responseType = "blob";

      request.onload = function () {
        var image = request.response;
        var url = URL.createObjectURL(image);
        _this.photoURL = url;
      };

      request.send(params);
    }
  }, {
    key: "searchForHighlightedWords",
    value: function searchForHighlightedWords(search) {
      var foundWords = [];
      var searchString = search.toLowerCase();
      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = this.searchWords[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var word = _step2.value;

          if (word === searchString) {
            foundWords.push(search);
          } else if (word.length > searchString.length) {
            var res = word.substr(0, searchString.length);

            if (res === searchString) {
              foundWords.push(word);
            }
          }
        }
      } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion2 && _iterator2["return"] != null) {
            _iterator2["return"]();
          }
        } finally {
          if (_didIteratorError2) {
            throw _iteratorError2;
          }
        }
      }

      return {
        isHighlighted: foundWords.length > 0,
        highlightedWords: foundWords
      };
    }
  }, {
    key: "renderDiv",
    value: function renderDiv() {
      var div = document.createElement("div");
      div.setAttribute("class", "galleryDiv");
      var title = document.createElement("h2");
      title.textContent = this.title;
      title.setAttribute("class", "galleryTitle");
      var photo = document.createElement("img");
      photo.setAttribute("src", this.photoURL);
      photo.setAttribute("class", "galleryThumbnail");
      div.appendChild(title);
      div.appendChild(photo);
      return div;
    }
  }]);

  return Gallery;
}();

exports.Gallery = Gallery;
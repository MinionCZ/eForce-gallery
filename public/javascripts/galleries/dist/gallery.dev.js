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
    this.photosCount = gallery.photos;
    this.contributor = gallery.contributor;
    this.lastChanges = gallery.lastChanges;
    this.label = gallery.label;
    this.photoURL = "/photo-gallery/get-photo?title=" + gallery.title;
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
      var imageDiv = document.createElement("div");
      imageDiv.setAttribute("class", "imageDiv");
      var photo = document.createElement("img");
      photo.setAttribute("src", this.photoURL);
      photo.setAttribute("class", "galleryThumbnail");
      div.appendChild(title);
      div.appendChild(imageDiv);
      imageDiv.appendChild(photo);
      div.appendChild(this.generateStatsDiv());
      var tagDivs = this.generateTagDiv();
      var _iteratorNormalCompletion3 = true;
      var _didIteratorError3 = false;
      var _iteratorError3 = undefined;

      try {
        for (var _iterator3 = tagDivs[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
          var tagDiv = _step3.value;
          div.appendChild(tagDiv);
        }
      } catch (err) {
        _didIteratorError3 = true;
        _iteratorError3 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion3 && _iterator3["return"] != null) {
            _iterator3["return"]();
          }
        } finally {
          if (_didIteratorError3) {
            throw _iteratorError3;
          }
        }
      }

      return div;
    }
  }, {
    key: "generateStatsDiv",
    value: function generateStatsDiv() {
      var statsDiv = document.createElement("div");
      var photosCount = "";

      if (this.photosCount === 0) {
        photosCount = "empty";
      } else {
        photosCount = this.photosCount;
      }

      statsDiv.setAttribute("class", "statsDiv");
      statsDiv.innerHTML = "Contributor: " + this.contributor;
      statsDiv.innerHTML += "<br>" + "Number of photos: " + photosCount;
      statsDiv.innerHTML += "<br>" + "Date of event: " + this.eventDate;
      statsDiv.innerHTML += "<br>" + "Date of contribution: " + this.contributionDate;
      return statsDiv;
    }
  }, {
    key: "generateTagDiv",
    value: function generateTagDiv() {
      var tagLines = [];
      var mainIndex = 0;
      var div = document.createElement("div");
      div.setAttribute("class", "tagLine");
      tagLines.push(div);
      var _iteratorNormalCompletion4 = true;
      var _didIteratorError4 = false;
      var _iteratorError4 = undefined;

      try {
        for (var _iterator4 = this.tags[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
          var tag = _step4.value;

          if (mainIndex == 3) {
            mainIndex = 0;
            div = document.createElement("div");
            div.setAttribute("class", "tagLine");
            tagLines.push(div);
          }

          mainIndex++;
          div.appendChild(this.generateTag(tag));
        }
      } catch (err) {
        _didIteratorError4 = true;
        _iteratorError4 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion4 && _iterator4["return"] != null) {
            _iterator4["return"]();
          }
        } finally {
          if (_didIteratorError4) {
            throw _iteratorError4;
          }
        }
      }

      tagLines[tagLines.length - 1].setAttribute("class", "tagLineLast");
      return tagLines;
    }
  }, {
    key: "generateTag",
    value: function generateTag(tag) {
      var tagBtn = document.createElement("button");
      tagBtn.setAttribute("class", "tag");
      tagBtn.textContent = tag;
      return tagBtn;
    }
  }, {
    key: "hasTag",
    value: function hasTag(tag) {
      var hasTag = false;

      for (var i = 0; i < this.tags.length; i++) {
        if (this.tags[i] === tag) {
          hasTag = true;
          break;
        }
      }

      return hasTag;
    }
  }]);

  return Gallery;
}();

exports.Gallery = Gallery;
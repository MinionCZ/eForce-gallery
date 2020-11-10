"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var galleries = [];

function createLayout(galleries) {
  console.log(galleries);
  fetchGalleriesInfo();
}

function fetchGalleriesInfo() {
  var request = new XMLHttpRequest();
  request.addEventListener("load", handleGalleryInformation);
  request.open("GET", "/galleries/get-all");
  request.send();
}

function handleGalleryInformation() {
  var galleriesInfo = JSON.parse(this.responseText);
  console.log(galleriesInfo);
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = galleriesInfo[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var gal = _step.value;
      galleries.push(new Gallery(gal));
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
}

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
    this.label = gallery.label; //this.firstPhoto = firstPhoto

    this.searchWords = this.generateSearchWords();
    this.isRendered = true;
    console.log(this.searchForHighlightedWords("20"));
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
      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = label[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var _char = _step2.value;

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
      var _iteratorNormalCompletion3 = true;
      var _didIteratorError3 = false;
      var _iteratorError3 = undefined;

      try {
        for (var _iterator3 = this.searchWords[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
          var word = _step3.value;

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

      return {
        isHighlighted: foundWords.length > 0,
        highlightedWords: foundWords
      };
    }
  }]);

  return Gallery;
}();
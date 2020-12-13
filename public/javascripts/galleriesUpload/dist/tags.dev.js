"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.generateTagInput = generateTagInput;
exports.submitForm = submitForm;

var _dataVerifier = require("./dataVerifier.js");

var id = 0;
var tagsArray = [];

function deleteTagAndSortOthers(child) {
  if (tagsArray.length == 1) {
    return;
  }

  for (var i = 0; i < tagsArray.length; i++) {
    if (tagsArray[i].id === child.id) {
      tagsArray.splice(i, 1);
    }
  }

  document.getElementById("tags").removeChild(child);

  for (var _i = 0; _i < tagsArray.length; _i++) {
    document.getElementById(tagsArray[_i].id).id = "tagDivId=" + _i;
    tagsArray[_i].id = "tagDivId=" + _i;
  }

  id = tagsArray.length;
  document.getElementById("tagsCounter").value = JSON.stringify(id);
}
/*
generates new tag and add it to the body
*/


function generateTagInput() {
  var root = document.createElement("div");
  root.id = "tagDivId=" + id;
  root.className = "tag-div";
  var input = document.createElement("input");
  input.type = "text";
  input.name = "tagId=" + id;
  input.className = "tag-input";
  input.id = "tagId=" + id;
  input.setAttribute("list", "list" + input.id);
  var deleteButton = document.createElement("button");
  deleteButton.type = "button";
  deleteButton.addEventListener("click", function () {
    deleteTagAndSortOthers(root);
  });
  deleteButton.className = "delete-button";
  deleteButton.textContent = "\u2715";
  root.appendChild(input);
  root.appendChild(deleteButton);
  root.appendChild((0, _dataVerifier.getDatalistWithTagsForInput)(input.id));
  document.getElementById("tags").appendChild(root);
  tagsArray.push(root);
  id++;
  document.getElementById("tagsCounter").value = JSON.stringify(id);
}
/*
sucks data out of tags
*/


function submitForm() {
  var tags = [];
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = tagsArray[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var tag = _step.value;
      var tagValue = document.getElementById(tag.id).children[0].value;
      tags.push({
        tagValue: tagValue
      });
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

  document.getElementById("tagsValue").value = JSON.stringify(tags);
  document.getElementById("galleryForm").submit();
}
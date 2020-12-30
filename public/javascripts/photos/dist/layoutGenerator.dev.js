"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.buildDownloadLayout = buildDownloadLayout;
exports.buildDeleteLayout = buildDeleteLayout;
exports.createPopupWindow = createPopupWindow;

var _requests = require("./requests.js");

function generateDownloadButton(text, version, size, selectedPhotos, root) {
  var downloadButton = document.createElement("button");

  if (version === "lite") {
    downloadButton.setAttribute("class", "download-selection-button right");
  } else {
    downloadButton.setAttribute("class", "download-selection-button left");
  }

  downloadButton.innerHTML = text + size;

  downloadButton.onclick = function () {
    (0, _requests.downloadSelectedPhotos)(selectedPhotos.photos, selectedPhotos.allSelected, version, []);
    document.body.removeChild(root);
  };

  return downloadButton;
}
/*
builds download layout
*/


function buildDownloadLayout(selectedPhotos, size) {
  var root = document.createElement("div");

  root.onclick = function () {
    document.body.removeChild(root);
  };

  root.setAttribute("class", "root");
  var downloadDiv = document.createElement("div");
  downloadDiv.setAttribute("class", "download-div");
  var downloadLite = generateDownloadButton("Download lite version <br> Size ~ ", "lite", size.liteSize, selectedPhotos, root);
  var downloadFull = generateDownloadButton("Download full version <br> Size ~ ", "full", size.fullSize, selectedPhotos, root);
  var titleDiv = document.createElement("div");
  titleDiv.setAttribute("class", "title-download-div");
  titleDiv.innerHTML = "Choose option for download:";
  downloadDiv.appendChild(titleDiv);
  downloadDiv.appendChild(downloadFull);
  downloadDiv.appendChild(downloadLite);
  downloadDiv.appendChild(generateCancelButton(root));
  root.appendChild(downloadDiv);
  document.body.appendChild(root);
}
/*
generates button for dialog close, its cross for closing
*/


function generateCancelButton(root) {
  var cancelButton = document.createElement("button");
  cancelButton.textContent = "\u2715";
  cancelButton.setAttribute("class", "cancel-button");

  cancelButton.onclick = function () {
    document.body.removeChild(root);
  };

  return cancelButton;
}
/*
builds delete layout for confirmation of deleting photos
*/


function buildDeleteLayout(photosCount, selectedPhotos) {
  var root = document.createElement("div");
  root.setAttribute("class", "root");

  root.onclick = function () {
    if (document.body.contains(root)) {
      document.body.removeChild(root);
    }
  };

  var deleteDiv = document.createElement("div");
  deleteDiv.setAttribute("class", "download-div");
  var titleDiv = document.createElement("div");
  titleDiv.setAttribute("class", "title-download-div");
  titleDiv.innerHTML = "Do you really wish to delete " + photosCount + (photosCount === 1 ? " photo?" : " photos?");
  var deleteButton = generateButton("", "right delete-button", "Delete");
  var cancelButton = generateButton("", "left cancel-delete-button", "Cancel");

  deleteButton.onclick = function () {
    (0, _requests.deleteSelected)(selectedPhotos.photos, selectedPhotos.allSelected);
    document.body.removeChild(root);
  };

  cancelButton.onclick = function () {
    document.body.removeChild(root);
  };

  root.appendChild(deleteDiv);
  deleteDiv.appendChild(titleDiv);
  deleteDiv.appendChild(deleteButton);
  deleteDiv.appendChild(cancelButton);
  deleteDiv.appendChild(generateCancelButton(root));
  document.body.appendChild(root);
}
/*
function with 3 params for generating layout
params are optional, so empty button can be generated
*/


function generateButton() {
  var id = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "";
  var cssClass = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "";
  var text = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "";
  var button = document.createElement("button");

  if (id !== "") {
    button.setAttribute("id", id);
  }

  if (cssClass !== "") {
    button.setAttribute("class", cssClass);
  }

  button.textContent = text;
  return button;
}
/*
creates popup window with settable time and text
good for informing user, 3 second is default time 
*/


function createPopupWindow(text) {
  var time,
      popup,
      textDiv,
      _args = arguments;
  return regeneratorRuntime.async(function createPopupWindow$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          time = _args.length > 1 && _args[1] !== undefined ? _args[1] : 3000;
          popup = document.createElement("div");
          popup.setAttribute("id", "popup");
          popup.setAttribute("class", "popup");
          textDiv = document.createElement("div");
          textDiv.innerHTML = text;
          textDiv.setAttribute("class", "popup-text-div");
          popup.appendChild(textDiv);
          popup.style.width = text.length + 10 + "ch";
          popup.style.right = "calc(50% - " + (text.length + 10) / 2 + "ch)";
          document.body.appendChild(popup);
          setTimeout(function () {
            document.body.removeChild(popup);
          }, time);

        case 12:
        case "end":
          return _context.stop();
      }
    }
  });
}
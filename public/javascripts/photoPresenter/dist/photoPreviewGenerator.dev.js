"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.generateTopLine = generateTopLine;
exports.generateRootElement = generateRootElement;
exports.generateSideButtons = generateSideButtons;
exports.generatePhotoView = generatePhotoView;
exports.setPhotoToPreview = setPhotoToPreview;

/*
generates root element for photo preview
*/
function generateRootElement() {
  var root = document.createElement("div");
  root.setAttribute("id", "root");
  root.setAttribute("class", "root");

  root.onclick = function (event) {
    if (document.body.contains(root)) {
      if (event.target.id === "root" || event.target.id === "photoDiv") {
        document.body.removeChild(root);
      }
    }
  };

  return root;
}
/*
generates side buttons for photo changing next/previous
 */


function generateSideButtons(leftCallback, rightCallback) {
  var leftButton = document.createElement("button");
  var rightButton = document.createElement("button");
  leftButton.setAttribute("class", "left photo-button");
  leftButton.textContent = "<";
  rightButton.setAttribute("class", "right photo-button");
  rightButton.textContent = ">";

  leftButton.onclick = function () {
    leftCallback();
  };

  rightButton.onclick = function () {
    rightCallback();
  };

  return {
    leftButton: leftButton,
    rightButton: rightButton
  };
}
/*
generates button for leaving photo preview
*/


function generateExitButton(root) {
  var exitButton = document.createElement("button");
  exitButton.textContent = "\u2715";
  exitButton.setAttribute("class", "exit-button");

  exitButton.onclick = function () {
    if (document.body.contains(root)) {
      document.body.removeChild(root);
      console.log(root);
    }
  };

  return exitButton;
}
/*
generates button for communication with backend 
here it will generate delete button and download button, which will communicate with server
*/


function generateBackendButton(filename, callback, cssClass, text, title) {
  var version = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : "";
  var button = document.createElement("button");
  button.setAttribute("class", cssClass);
  button.textContent = text;
  button.title = title;
  button.value = version;

  button.onclick = function () {
    console.log(filename);
  };

  return button;
}
/*
generates top line of buttons
*/


function generateTopLine(filename, callbackDownload, callbackDelete, root) {
  var div = document.createElement("div");
  div.setAttribute("class", "top-line-div");
  div.appendChild(generateBackendButton(filename, callbackDownload, "top-button download-full", "⟱", "download full version of photo", "full"));
  div.appendChild(generateBackendButton(filename, callbackDownload, "top-button download-lite", "⇓", "download lite version of photo", "lite"));
  div.appendChild(generateBackendButton(filename, callbackDelete, "top-button delete", "🗑", "delete photo", ""));
  div.appendChild(generateExitButton(root));
  return div;
}
/*
generates photo template with fetched photo from backend
*/


function generatePhotoView() {
  var source = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "";
  var photoDiv = document.createElement("div");
  photoDiv.setAttribute("id", "photoDiv");
  var photo = document.createElement("img");
  photo.setAttribute("class", "photo bottom");
  photo.setAttribute("id", "photo");
  photo.setAttribute("src", source);

  photo.onload = function () {
    var newPhoto = document.createElement("img");
    newPhoto.setAttribute("class", "photo");
    newPhoto.src = source;
    photoDiv.appendChild(newPhoto);
    photoDiv.removeChild(newPhoto);
  };

  photoDiv.setAttribute("class", "photo-div-preview");
  photoDiv.appendChild(photo);
  return photoDiv;
}
/*
sets new photo to be previewed
*/


function setPhotoToPreview(source) {
  document.getElementById("photo").src = source;
}
"use strict";

var _dataVerifier = require("../dataVerifier.js");

var _tags = require("../tags.js");

window.onload = function () {
  /*
  adding event listeners to drag and drop field
  */
  var dropArea = document.getElementById("dragAndDropArea");

  if (dropArea) {
    dropArea.addEventListener("drop", handleDrop, false);
    dropArea.addEventListener("dragenter", handleDragging, false);
    dropArea.addEventListener("dragleave", handleDragLeave, false);
    dropArea.addEventListener("dragover", function (event) {
      event.preventDefault();
    });
  }

  function handleDragging(event) {
    event.preventDefault();
    dropArea.style["background-color"] = "#99CCFF";
  }

  function handleDragLeave(event) {
    event.preventDefault();
    dropArea.style["background-color"] = "lightgray";
  }

  function handleDrop(event) {
    event.preventDefault();
    var dt = event.dataTransfer;
    dropArea.style["background-color"] = "lightgray";
    handleDataUpload(dt.files);
  }
  /*
  button handling starts here
  */


  var fileInput = document.getElementById("buttonFiles");

  fileInput.onchange = function () {
    handleDataUpload(fileInput.files);
  };
  /*
  sets listener for gallery title, checking if is used
  */


  document.getElementById("title").addEventListener("input", _dataVerifier.isTitleUsed);
  /*
  generates first tag input
  */

  (0, _tags.generateTagInput)();
  /*
  sets listener for new tags button 
  */

  document.getElementById("tagButton").addEventListener("click", _tags.generateTagInput);
  /*
  sets listener for submit button click
  */

  document.getElementById("submitButton").addEventListener("click", _tags.submitForm);
  /*
  sets today date to date of event
  */

  var getToday = function getToday() {
    var date = new Date();
    var day = date.getDate();
    var month = date.getMonth() + 1;

    if (date.getDate() < 10) {
      day = "0" + date.getDate();
    }

    if (date.getMonth() + 1 < 10) {
      month = "0" + (date.getMonth() + 1);
    }

    return date.getFullYear() + "-" + month + "-" + day;
  };

  document.getElementById("date").value = getToday();
};
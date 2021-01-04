"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getMaxPage = getMaxPage;
exports.incrementHandler = incrementHandler;
exports.decrementHandler = decrementHandler;
exports.setMaxPage = setMaxPage;
exports.handleWritePage = handleWritePage;
exports.getPage = getPage;

var _photosStore = require("./photosStore.js");

var _topSelectorHandler = require("./topSelectorHandler.js");

var page = 1;
var maxPage = 1;
/*
sets max page from photos counted
*/

function setMaxPage(photos) {
  var pages = Math.floor(photos / 60);

  if (photos % 60 !== 0) {
    pages++;
  }

  maxPage = pages;
  handleUIChange();
}
/*
return max page
*/


function getMaxPage() {
  return maxPage;
}
/*
increments page after button click
*/


function incrementHandler() {
  if (page < maxPage) {
    page++;

    _photosStore.PhotosStore.fetchPage(page);

    handleUIChange();
  }
}
/*
decrement page after button click
*/


function decrementHandler() {
  if (page > 1) {
    page--;

    _photosStore.PhotosStore.fetchPage(page);

    handleUIChange();
  }
}
/*
handles ui change, sets buttons disabled, changes page etc
*/


function handleUIChange() {
  var decrementButton = document.getElementById("decrementPageButton");
  var incrementButton = document.getElementById("incrementPageButton");
  decrementButton.disabled = page === 1;
  incrementButton.disabled = page === maxPage;
  document.getElementById("pageInput").value = page;
  document.getElementById("maxPages").textContent = "/" + maxPage;
  document.getElementById("selectAllPhotosOnPage").textContent = (0, _topSelectorHandler.isPageSelected)(page) ? "Deselect all on page" : "Select all on page";
}
/*
handles page insert into page input, checks valid chars and length
 */


function handleWritePage(event) {
  var keyPressed = event.key;
  var pageInput = document.getElementById("pageInput");
  var allOk = true;
  var isLetterCorrect = isCorrectLetter(keyPressed);

  if (!isLetterCorrect.valid) {
    event.preventDefault();
    allOk = false;
  } else {
    if (!isLengthOk(isLetterCorrect, pageInput)) {
      event.preventDefault();
      allOk = false;
    }

    if (!isPageOk(pageInput.value, keyPressed, isLetterCorrect)) {
      event.preventDefault();
      allOk = false;
    }
  }

  if (allOk && keyPressed === "Enter") {
    event.preventDefault();
    getSelectedPage(pageInput);
  }
}
/*
checks all possible keys, that can be inserted, numbers + Backspace
*/


function isCorrectLetter(letter) {
  var keys = new Set(["Backspace", "Enter"]);

  for (var i = 0; i < 10; i++) {
    keys.add("" + i);
  }

  var isNumber = letter.length === 1;
  var isValid = keys.has(letter);
  return {
    valid: isValid,
    number: isNumber
  };
}
/*
returns if length is shorter than 3 characters
*/


function isLengthOk(isLetterCorrect, pageInput) {
  var length = pageInput.value.length;

  if (length === 3 && !isLetterCorrect.number) {
    return false;
  }

  return true;
}
/*
returns data if the page inserted by user is smaller than max page
*/


function isPageOk(pageInInput, key, isLetterCorrect) {
  if (!isLetterCorrect.number) {
    return true;
  } else {
    var finalPage = parseInt(pageInInput + key);
    return finalPage <= maxPage && finalPage >= 1;
  }
}
/*
renders new page from backend
*/


function getSelectedPage(pageInInput) {
  if (pageInInput.value.length === 0) {
    alert("Please select valid page");
  } else {
    var newPage = parseInt(pageInInput.value);
    page = newPage;
    handleUIChange();

    _photosStore.PhotosStore.fetchPage(page);
  }
}

function getPage() {
  return page;
}
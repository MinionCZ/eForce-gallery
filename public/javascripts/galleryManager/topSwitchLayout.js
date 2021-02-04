import { buildMainPage, clearMainPage } from "./mainPageGenerator.js";
import{
  buildPhotosLayout, clearPhotoLayout
}from "./photosShower/photoPageGenerator.js"
let infoSelected = true;
/*
generates top bar with switches
*/
function generateTopSwitchLayout() {
  const div = document.createElement("div");
  div.setAttribute("class", "top-switch-div");
  const info = document.createElement("button");
  info.setAttribute("id", "topSwitchInfoButton")
  info.setAttribute("class", "top-switch-button selected");
  const photos = document.createElement("button");
  photos.setAttribute("class", "top-switch-button");
  photos.setAttribute("id", "topSwitchPhotosButton")
  info.innerText = "Information";
  photos.innerText = "Photos";
  info.onclick = () => {
    clearPhotoLayout()
    buildMainPage();
    infoSelected = true
    changeSelection()
  };
  photos.onclick = () => {
      infoSelected = false
      clearMainPage()
      buildPhotosLayout()
      changeSelection()
  };
  div.appendChild(info);
  div.appendChild(photos);
  return div;
}


function changeSelection() {
  const info = document.getElementById("topSwitchInfoButton")
  const photos = document.getElementById("topSwitchPhotosButton")
  if (infoSelected) {
    info.setAttribute("class", "top-switch-button selected");
    photos.setAttribute("class", "top-switch-button")
  } else {
    photos.setAttribute("class", "top-switch-button selected");
    info.setAttribute("class", "top-switch-button")
  }
}

export { generateTopSwitchLayout };

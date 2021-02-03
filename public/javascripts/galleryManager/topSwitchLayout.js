import { buildMainPage, clearMainPage } from "./mainPageGenerator.js";
import{
  buildPhotosLayout
}from "./photosShower/photoPageGenerator.js"
let infoSelected = true;
/*
generates top bar with switches
*/
function generateTopSwitchLayout() {
  const div = document.createElement("div");
  div.setAttribute("class", "top-switch-div");
  const info = document.createElement("button");
  info.setAttribute("class", "top-switch-button");
  const photos = document.createElement("button");
  photos.setAttribute("class", "top-switch-button");
  info.innerText = "Information";
  photos.innerText = "Photos";
  info.onclick = () => {
    buildMainPage();
    infoSelected = true
  };
  photos.onclick = () => {
      infoSelected = false
      clearMainPage()
      buildPhotosLayout()
  };
  div.appendChild(info);
  div.appendChild(photos);
  if (infoSelected) {
    info.setAttribute("class", "top-switch-button selected");
  } else {
    photos.setAttribute("class", "top-switch-button selected");
  }
  return div;
}

export { generateTopSwitchLayout };

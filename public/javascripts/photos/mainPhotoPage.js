import {PhotosStore} from "./photosStore.js"
import {toggleSideBar} from "./sideBars.js"
import{initTopSelector, topButtonsDisable} from "./topSelectorHandler.js"
window.onload = () =>{
    document.getElementById("tagsToggleLeft").addEventListener("click", toggleSideBar)
    document.getElementById("tagsToggleRight").addEventListener("click", toggleSideBar)
    document.getElementById("closeGalleries").addEventListener("click", toggleSideBar)
    document.getElementById("closeTags").addEventListener("click", toggleSideBar)
    initTopSelector()
    topButtonsDisable()
    PhotosStore.fetchPage(1)

}
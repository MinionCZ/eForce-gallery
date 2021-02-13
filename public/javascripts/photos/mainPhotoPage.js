import {PhotosStore} from "./photosStore.js"
import {handleAddGalleryOrTag, toggleSideBar, initLogicButtonHandlers} from "./sideBars.js"
import{initTopSelector, topButtonsDisable} from "./topSelectorHandler.js"
window.onload = () =>{
    document.getElementById("tagsToggleLeft").addEventListener("click", toggleSideBar)
    document.getElementById("tagsToggleRight").addEventListener("click", toggleSideBar)
    document.getElementById("closeGalleries").addEventListener("click", toggleSideBar)
    document.getElementById("closeTags").addEventListener("click", toggleSideBar)
    document.getElementById("addTagsButton").addEventListener("click", handleAddGalleryOrTag)
    document.getElementById("addGalleryButton").addEventListener("click", handleAddGalleryOrTag)
    initTopSelector()
    topButtonsDisable()
    initLogicButtonHandlers()
    PhotosStore.fetchPage(1)
}
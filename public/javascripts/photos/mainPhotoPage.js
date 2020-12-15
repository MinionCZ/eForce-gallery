import {PhotosStore} from "./photosStore.js"
import {toggleSideBar} from "./sideBars.js"
window.onload = () =>{
    document.getElementById("tagsToggleLeft").addEventListener("click", toggleSideBar)
    document.getElementById("tagsToggleRight").addEventListener("click", toggleSideBar)
    document.getElementById("closeGalleries").addEventListener("click", toggleSideBar)
    document.getElementById("closeTags").addEventListener("click", toggleSideBar)

    PhotosStore.fetchPage(1, 60)

}
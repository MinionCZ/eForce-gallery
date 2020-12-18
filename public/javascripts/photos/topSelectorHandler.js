import {
    PhotosStore
} from "./photosStore.js"
import {
    CheckStore
} from "./checkStore.js"
let selectAllOnPageClicked = false

import {
    buildDownloadLayout,
}from "./layoutGenerator.js"

/*
sets max page on top of div
*/

function setMaxPage(photos) {
    let pages = Math.floor(photos / 60)
    if (photos % 60 > 0) {
        pages++
    }
    document.getElementById("maxPages").innerHTML = "/" + pages
}

/*
handles button that selects all photos on page, works iff not all photos are selected
*/

function selectAllOnPage() {
    if (CheckStore.allSelected) {
        return
    }
    if (!selectAllOnPageClicked) {
        document.getElementById("selectAllPhotosOnPage").textContent = "Deselect all on page"
    } else {
        document.getElementById("selectAllPhotosOnPage").textContent = "Select all on page"
    }
    selectAllOnPageClicked = !selectAllOnPageClicked
    PhotosStore.setStateOfAllPhotos(selectAllOnPageClicked)
}

/*
selects all photos
*/
function selectAll() {
    if (CheckStore.allSelected){
        document.getElementById("selectAllPhotos").textContent = "Select all"
    }else{
        document.getElementById("selectAllPhotos").textContent = "Deselect all"
        document.getElementById("selectAllPhotosOnPage").textContent = "Select all on page"
        selectAllOnPageClicked = false
    }
    CheckStore.toggleAllSelected()
}

/*
handles download options
creates div with 2 buttons to select which version user wants to download
*/
function handleDownload(){
    const selectedPhotos = CheckStore.getSelectedPhotos()
    const size = PhotosStore.sumPhotosSize(selectedPhotos.photos, selectedPhotos.allSelected)
    buildDownloadLayout(selectedPhotos, size)
}







/*
init all buttons on top selector, it is called from mainPhotoPage, where is it called after window is loaded
*/

function initTopSelector() {
    document.getElementById("selectAllPhotosOnPage").addEventListener("click", selectAllOnPage)
    document.getElementById("selectAllPhotos").addEventListener("click", selectAll)
    document.getElementById("downloadButton").addEventListener("click", handleDownload)
}


export {
    setMaxPage,
    initTopSelector
}
import {
    PhotosStore
} from "./photosStore.js"
import {
    CheckStore
} from "./checkStore.js"
import {
    buildDownloadLayout,
}from "./layoutGenerator.js"

import{
    incrementHandler,
    decrementHandler,
    handleWritePage,
    getPage
} from "./pageHandler.js"

const selectedPages = new Set()

/*
handles button that selects all photos on page, works iff not all photos are selected
*/

function selectAllOnPage() {
    if (CheckStore.allSelected) {
        return
    }
    if (!selectedPages.has(getPage())) {
        document.getElementById("selectAllPhotosOnPage").textContent = "Deselect all on page"
        selectedPages.add(getPage())
    } else {
        document.getElementById("selectAllPhotosOnPage").textContent = "Select all on page"
        selectedPages.delete(getPage())
    }
    PhotosStore.setStateOfAllPhotos(selectedPages.has(getPage()))
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
    document.getElementById("incrementPageButton").addEventListener("click", incrementHandler)
    document.getElementById("decrementPageButton").addEventListener("click", decrementHandler)
    document.getElementById("pageInput").addEventListener("keydown", handleWritePage)
}

/*
disables and enables buttons: download selected, delete selected and add selected to gallery, preventing using when is nothing selected
can be called without argument to disable
*/
function topButtonsDisable(status = true){
    document.getElementById("downloadButton").disabled = status
    document.getElementById("deleteButton").disabled = status
    document.getElementById("addToGalleryButton").disabled = status
}
function isPageSelected(page){
    return selectedPages.has(page)
}



export {
    initTopSelector,
    topButtonsDisable,
    isPageSelected
}
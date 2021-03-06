import {
    generateActionButton
} from "./sideBarGenerator.js"

import {
    PhotoStore
} from "../photosShower/photoStore.js"
import {
    buildLayout
} from "../photosShower/photoPageGenerator.js"
import { buildDownloadLayout, createPopupWindow } from "../../photos/layoutGenerator.js"
import { createConfirmWindow } from "../../confirmWindow/confirmWindow.js"
import {
    GalleryStore
} from "../galleryStore.js"
import {
    fetchGalleryByTitle
}from"../galleryFetcher.js"
/*
generates photo side bars
*/
function generatePhotoSideBar() {
    const holderDiv = document.createElement("div")
    holderDiv.setAttribute("class", "side-bar-action-div")
    holderDiv.appendChild(createPageDiv())
    holderDiv.appendChild(generateActionButton("Select all photos", selectAllPhotos, "selectAllPhotosButton"))
    holderDiv.appendChild(generateActionButton("Select all photos on page", selectAllPhotosOnThisPage, "selectAllPhotosOnPageButton"))
    holderDiv.appendChild(generateActionButton("Download selected photos", handleDownload))
    holderDiv.appendChild(generateActionButton("Delete selected photos", handleDelete))
    return holderDiv
}
/*
creates page div 
*/
function createPageDiv() {
    const div = document.createElement("div")
    const textPageInput = document.createElement("input")
    const maxPageLabel = document.createElement("label")

    div.setAttribute("class", "page-holder-div")
    textPageInput.setAttribute("class", "actual-page-input")
    textPageInput.setAttribute("id", "actualPageInput")
    textPageInput.setAttribute("type", "text")
    textPageInput.innerText = "" + PhotoStore.getActualPage()
    textPageInput.addEventListener("keydown", handlePageInput)
    textPageInput.addEventListener("focusout", setNewActualPage)

    maxPageLabel.setAttribute("class", "max-page-label")
    maxPageLabel.setAttribute("id", "maxPageLabel")
    maxPageLabel.innerText = "/" + PhotoStore.getMaxPage()
    div.appendChild(createChangePageButtons("decrement", false))
    div.appendChild(textPageInput)
    div.appendChild(maxPageLabel)
    div.appendChild(createChangePageButtons("increment", true))
    return div
}
/*
creates change page buttons for increment and decrement buttons
*/
function createChangePageButtons(cssClass, increment) {
    const button = document.createElement("button")
    button.setAttribute("class", "change-page-button " + cssClass)
    if (increment) {
        button.setAttribute("id", "incrementPageButton")
    } else {
        button.setAttribute("id", "decrementPageButton")
    }
    button.onclick = () => {
        let actual = PhotoStore.getActualPage()
        if (increment) {
            actual++
        } else {
            actual--
        }
        PhotoStore.setActualPage(actual)
        updateActualPageInput()
    }
    return button
}
/*
updates actual page on GUI
*/
function updateActualPageInput() {
    document.getElementById("actualPageInput").value = PhotoStore.getActualPage()
    document.getElementById("incrementPageButton").disabled = PhotoStore.getActualPage() === PhotoStore.getMaxPage()
    document.getElementById("decrementPageButton").disabled = PhotoStore.getActualPage() === 1
    document.getElementById("maxPageLabel").innerText = PhotoStore.getMaxPage()
    buildLayout()
    isThisPageTagged()

}

/*
handles page input event
*/
function handlePageInput(event) {
    if (!checkInput(event.key)) {
        event.preventDefault()
    } else {
        if (event.key === "Enter") {
            setNewActualPage()
        } else if (event.key !== "Backspace" && document.getElementById("actualPageInput").value.length >= 2) {
            event.preventDefault()
        }
    }

}

/*
checks input if it is valible key
*/
function checkInput(key) {
    if (key === "Backspace" || key === "Enter" || key === "Delete") {
        return true
    }
    const allowedChars = new Set("0123456789".split(""))
    return allowedChars.has(key)
}

/*
sets new Actual Page 
*/
function setNewActualPage() {
    const page = document.getElementById("actualPageInput").value
    let newPage = parseInt(page)
    if (newPage < 1) {
        newPage = 1
    }
    if (newPage > PhotoStore.getMaxPage()) {
        newPage = PhotoStore.getMaxPage()
    }
    PhotoStore.setActualPage(newPage)
    updateActualPageInput()
}

/*
selects and tags all photos
*/
function selectAllPhotos(){
    if(PhotoStore.areAllPhotosTagged()){
        PhotoStore.unTagAllPhotos()
        document.getElementById("selectAllPhotosButton").innerText = "Select all photos"
    }else{
        PhotoStore.tagAllPhotos()
        document.getElementById("selectAllPhotosButton").innerText = "Deselect all photos"
    }
}
/*
selects all photos on page and tag them
*/
function selectAllPhotosOnThisPage(){
    if(PhotoStore.isPageTagged()){
        PhotoStore.unTagAllPhotosOnPage()
        document.getElementById("selectAllPhotosOnPageButton").innerText = "Select all photos on page"
    }else{
        PhotoStore.tagAllPhotosOnPage()
        document.getElementById("selectAllPhotosOnPageButton").innerText = "Deselect all photos on page"
    }
}
/*
changes text on button depending if is this page tagged
*/
function isThisPageTagged(){
    if(!PhotoStore.isPageTagged()){
        document.getElementById("selectAllPhotosOnPageButton").innerText = "Select all photos on page"
    }else{
        document.getElementById("selectAllPhotosOnPageButton").innerText = "Deselect all photos on page"
    }
}

/*
handles download action
*/
function handleDownload(){
    const taggedPhotos = PhotoStore.getAllTaggedPhotos()
    if(taggedPhotos.length === 0){
        createPopupWindow("You have not selected any photos")
        return
    }
    const selectedPhotos = {
        photos: PhotoStore.getAllTaggedPhotos(),
        allSelected: false
    }
    
    const size = PhotoStore.calculateSizeOfSelectedPhotos()
    buildDownloadLayout(selectedPhotos, size)
}

/*
handles delete click event
*/
function handleDelete() {
    const selectedPhotos = PhotoStore.getAllTaggedPhotos()
    if(selectedPhotos.length === 0){
        createPopupWindow("You have not selected any photos to delete")
        return
    }
    if(selectedPhotos.length === 1){
        createConfirmWindow("Do you really wish to delete this photo?", executeDelete)
    }else{
        createConfirmWindow("Do you really wish to delete this " + selectedPhotos.length + " photos?", executeDelete)
    }
    
}
/*
execute delete sequence of photos and layout refresh
*/
async function executeDelete() {
    const data = {
        galleryID: GalleryStore.getGallery().galleryID,
        photos: PhotoStore.getAllTaggedPhotos()
    }
    const response = await fetch("/eforce-gallery/gallery-manager/delete-photos-from-gallery", {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    refreshLayout()
    createPopupWindow((await response.json()).message)
}
/*
refreshes layout after deleting or changes
*/
async function refreshLayout() {
    GalleryStore.buildNewGallery(await fetchGalleryByTitle(GalleryStore.getGallery().title))
    await PhotoStore.obtainAllPhotos()
    buildLayout()
    updateActualPageInput()
}


export {
    generatePhotoSideBar,
    updateActualPageInput,
    refreshLayout
}
import {
    generateActionButton
} from "./sideBarGenerator.js"

import {
    GalleryStore
} from "../galleryStore.js"

import {
    GalleryPreview
} from "../../galleries/galleryPreview.js"

import {
    createPopupWindow
} from "../../photos/layoutGenerator.js"

import {
    changeUrl
} from "../galleryUpdater.js"
import {
    buildMainLayout
} from "../mainPageGenerator.js"

import{
    createConfirmWindow
}from "../../confirmWindow/confirmWindow.js"

import{
    createUploadWindow
}from "../../galleriesUpload/singlePhotosUpload/uploadWindow.js"
/*
generates main page layout for side toggle button
*/
function generateMainPageButtons() {
    const holderDiv = document.createElement("div")
    holderDiv.setAttribute("class", "side-bar-action-div")
    holderDiv.appendChild(generateActionButton("Download full version ~ " + GalleryStore.getGallery().fullSize, downloadFull))
    holderDiv.appendChild(generateActionButton("Download lite version ~ " + GalleryStore.getGallery().liteSize, downloadLite))
    holderDiv.appendChild(generateActionButton("Delete all photos", deleteAllPhotos))
    holderDiv.appendChild(generateActionButton("Delete gallery", deleteGallery))
    holderDiv.appendChild(generateActionButton("Upload photos", handleUpload))
    return holderDiv
}

/*
download lite whole gallery
*/
function downloadLite() {
    if (GalleryStore.getGallery().photos.length > 0) {
        GalleryPreview.sendRequestToDownloadGallery(GalleryStore.getGallery().galleryID, "lite")
    }else{
        createPopupWindow("This gallery is empty, cannot be downloaded")
    }
}
/*
downloads full gallery
*/
function downloadFull() {
    if (GalleryStore.getGallery().photos.length > 0) {
    GalleryPreview.sendRequestToDownloadGallery(GalleryStore.getGallery().galleryID, "full")
    }else{
        createPopupWindow("This gallery is empty, cannot be downloaded")
    }
}
/*
deletes all photos after click
*/
async function deleteAllPhotos() {
    if(GalleryStore.getGallery().photos.length === 0){
        createPopupWindow("This gallery is already empty")
        return
    }
    createConfirmWindow("Do you really wish to delete all photos in this gallery?", executeDeleteOfAllPhotos)
}
/*
executes delete of all photos after button click
*/
async function executeDeleteOfAllPhotos(){
    const data = {
        galleryID: GalleryStore.getGallery().galleryID,
        photos: GalleryStore.getGallery().photos
    }
    const response = await fetch("/eforce-gallery/gallery-manager/delete-photos-from-gallery", {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    changeUrl(GalleryStore.getGallery().title)
    await buildMainLayout()
    createPopupWindow((await response.json()).message)
}



/*
deletes gallery 
*/
function deleteGallery() {
    createConfirmWindow("Do you really wish to delete this gallery?", executeDeletionOfGallery)
}

/*
executes deletion of gallery and sends request to the server
*/
async function executeDeletionOfGallery(){
    const title = GalleryStore.getGallery().title
    const url = new URL(window.location.href)
    url.searchParams.delete("gallery-title")
    const response = await fetch("/eforce-gallery/gallery-manager/delete-gallery", {
        method: "POST",
        headers:{
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            galleryID:GalleryStore.getGallery().galleryID
        })
    })
    if((await response.json()).message === "success"){
        window.history.replaceState({}, null, url)
        buildMainLayout()
        createPopupWindow("Gallery \"" + title + "\" has been succesfully deleted")
    }else{
        reatePopupWindow("Something went wrong")
    }
}

/*
handles upload of new photos
*/

function handleUpload(){
    createUploadWindow(GalleryStore.getGallery().galleryID, buildMainLayout)
}

export {
    generateMainPageButtons
}
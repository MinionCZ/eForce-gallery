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

function generateMainPageButtons() {
    const holderDiv = document.createElement("div")
    holderDiv.setAttribute("class", "side-bar-action-div")
    holderDiv.appendChild(generateActionButton("Download full version ~ " + GalleryStore.getGallery().fullSize, downloadFull))
    holderDiv.appendChild(generateActionButton("Download lite version ~ " + GalleryStore.getGallery().liteSize, downloadLite))
    holderDiv.appendChild(generateActionButton("Delete all photos", deleteAllPhotos))
    holderDiv.appendChild(generateActionButton("Delete gallery", deleteGallery))
    return holderDiv
}

function downloadLite() {
    if (GalleryStore.getGallery().photos.length > 0) {
        GalleryPreview.sendRequestToDownloadGallery(GalleryStore.getGallery().galleryID, "lite")
    }else{
        createPopupWindow("This gallery is empty, cannot be downloaded")
    }
createConfirmWindow("are you sure", null)
}
function downloadFull() {
    if (GalleryStore.getGallery().photos.length > 0) {
    GalleryPreview.sendRequestToDownloadGallery(GalleryStore.getGallery().galleryID, "full")
    }else{
        createPopupWindow("This gallery is empty, cannot be downloaded")
    }
}
async function deleteAllPhotos() {
    if(GalleryStore.getGallery().photos.length === 0){
        createPopupWindow("This gallery is already empty")
        return
    }

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





function deleteGallery() {

}

export {
    generateMainPageButtons
}
import {
    generateActionButton
}from "./sideBarGenerator.js"

import{
    GalleryStore
}from "../galleryStore.js"

function generateMainPageButtons(){
    const holderDiv = document.createElement("div")
    holderDiv.setAttribute("class", "side-bar-action-div")
    holderDiv.appendChild(generateActionButton("Download full ~ " + GalleryStore.getGallery().fullSize, downloadFull))
    holderDiv.appendChild(generateActionButton("Download lite ~ " + GalleryStore.getGallery().liteSize, downloadLite))
    holderDiv.appendChild(generateActionButton("Delete all photos", deleteAllPhotos))
    holderDiv.appendChild(generateActionButton("Delete gallery", deleteGallery))
    return holderDiv
}

function downloadLite(){

}
function downloadFull(){

}
function deleteAllPhotos(){

}
function deleteGallery(){

}

export{
    generateMainPageButtons
}
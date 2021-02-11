import { createConfirmWindow } from "../confirmWindow/confirmWindow.js"
import{
    createPopupWindow
}from "../photos/layoutGenerator.js"
import{
    getOnlyImages
}from "../galleriesUpload/singlePhotosUpload/uploadWindow.js"
let dropArea = null
let imagesToUpload = null
let maxPhotos = 0
let photoId = 1
window.onload = () => {
    dropArea = document.getElementById("dragAndDropArea")
    dropArea.addEventListener("drop", onDrop)
    dropArea.addEventListener("dragend", onDragend)
    dropArea.addEventListener("dragenter", onDragEnter)
    dropArea.addEventListener("dragleave", onDragLeave)
    dropArea.addEventListener("dragover", (event) =>{
        event.preventDefault()
    })
    
    const uploadButton = document.getElementById("buttonFiles")
    uploadButton.onchange = () =>{
        handleUpload(uploadButton.files)
    }
}


function onDrop(event) {
    event.preventDefault()
    dropArea.className = "drag_and_drop_area"
    handleUpload(event.dataTransfer.files)
}
function onDragend(event) {
    event.preventDefault()
}
function onDragEnter(event) {
    event.preventDefault()
    dropArea.className = "drag_and_drop_area active"
}
function onDragLeave(event) {
    event.preventDefault()
    dropArea.className = "drag_and_drop_area"
}
function handleUpload(files) {
    const imagesData = getOnlyImages(files)
    if(!imagesData.allImages && imagesData.images.length > 0){
        imagesToUpload = imagesData.images
        createConfirmWindow("Only images will be uploaded! \nDo you wish to proceed?", executeUpload)
    }else if(imagesData.allImages){
        imagesToUpload = imagesData.images
        executeUpload()
    }else{
        createPopupWindow("You have not selected any images")
    }
}
async function executeUpload(){
    maxPhotos += imagesToUpload.length
    for(const photo of imagesToUpload){
        await uploadPhoto(photo)
    }
}
async function uploadPhoto(file) {
    changeStatus()
    const data = new FormData()
    data.append("photo", file)
    let url = "/eforce-gallery/photos/upload/without-gallery"
    const response = await fetch(url, {
        method: "post",
        body: data
    })
    const text = (await response.json()).message
    
    if(text === "ok"){
        changeStatus()
        photoId++
    }else{
        changeStatus("Something went wrong")
    }
}
function changeStatus(error = "") {
    const textBar = document.getElementById("dataStatus")
    if(error !== ""){
        textBar.innerText = error
        textBar.className = "data_upload_status error"
    }else{
        if(photoId < maxPhotos){
            textBar.innerText = "Uploading file " + photoId + "/" + maxPhotos
            textBar.className = "data_upload_status uploading"
        }else{
            textBar.innerText = photoId + " files uploaded"
            textBar.className = "data_upload_status done"
        }
    }

}

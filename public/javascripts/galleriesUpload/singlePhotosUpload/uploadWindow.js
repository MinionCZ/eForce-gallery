import {
    createConfirmWindow
} from "../../confirmWindow/confirmWindow.js"
let imagesToUpload = []
let galleryID = ""
let uploadedPhotosCounter = 1
let maxPhotos = 0
function createUploadWindow(galID = "",callback) {
    galleryID = galID
    const root = document.createElement("div")
    root.setAttribute("class", "uploading-window-root")
    root.setAttribute("id", "uploadingWindowRoot")
    root.appendChild(createDragAndDropArea())
    root.appendChild(createExitButton(root, callback))
    root.appendChild(generateStatusLayout())
    document.body.appendChild(root)
}

function createDragAndDropArea() {
    const dragAndDrop = document.createElement("div")
    dragAndDrop.setAttribute("class", "upload-window-drag-and-drop-area")
    dragAndDrop.addEventListener("drag", (event) => {
        event.preventDefault()
    })
    dragAndDrop.addEventListener("dragenter", (event) => {
        event.preventDefault()
        dragAndDrop.setAttribute("class", "upload-window-drag-and-drop-area active")
    })
    dragAndDrop.addEventListener("dragleave", (event) => {
        event.preventDefault()
        dragAndDrop.setAttribute("class", "upload-window-drag-and-drop-area")
    })
    dragAndDrop.addEventListener("dragend", (event) => {
        event.preventDefault()
        dragAndDrop.setAttribute("class", "upload-window-drag-and-drop-area")
    })
    dragAndDrop.addEventListener("dragover", (event) => {
        event.preventDefault()
    })
    dragAndDrop.addEventListener("drop", (event) => {
        event.preventDefault();
        dragAndDrop.setAttribute("class", "upload-window-drag-and-drop-area")
        handleDataUpload(event.dataTransfer.files)


    })
    dragAndDrop.appendChild(createTitle("Drag&Drop </br> or"))
    dragAndDrop.appendChild(createFileInput())
    return dragAndDrop

}

function createTitle(text) {
    const title = document.createElement("h2")
    title.innerHTML = text
    title.setAttribute("class", "upload-window-drag-and-drop-title")
    return title
}
function createFileInput() {
    const fileInput = document.createElement("input")
    fileInput.setAttribute("class", "upload-window-file-selector")
    fileInput.setAttribute("type", "file")
    fileInput.setAttribute("id", "uploadWindowFileInput")
    fileInput.multiple = true
    fileInput.onchange = () => {
        handleDataUpload(fileInput.files)
    }
    const label = document.createElement("label")
    label.setAttribute("for", "uploadWindowFileInput")
    label.setAttribute("class", "upload-window-file-selector-label")
    label.innerText = "Select files"

    const div = document.createElement("div")
    div.appendChild(label)
    div.appendChild(document.createElement("br"))
    div.appendChild(fileInput)
    return div
}
function createExitButton(root, callback) {
    const button = document.createElement("button")
    button.setAttribute("class", "upload-window-exit-button")
    button.innerText = "\u2715"
    button.onclick = () => {
        if (document.body.contains(root)) {
            document.body.removeChild(root)
            if(uploadedPhotosCounter > maxPhotos){
                callback()
            }
        }
        maxPhotos = 0
        uploadedPhotosCounter = 1
    }
    return button
}
function generateStatusLayout() {
    const statusLayout = document.createElement("label")
    statusLayout.setAttribute("class", "upload-window-status-label")
    statusLayout.setAttribute("id", "uploadWindowStatusLabel")
    statusLayout.innerText = "No files selected yet"
    return statusLayout
}
function changeStatus(status, text) {
    const statusLayout = document.getElementById("uploadWindowStatusLabel")
    statusLayout.setAttribute("class", "upload-window-status-label " + status)
    statusLayout.innerText = text
}

async function handleDataUpload(files) {
    const sortedFiles = getOnlyImages(files)
    imagesToUpload = sortedFiles.images
    if (sortedFiles.allImages) {
        executeUpload()
    } else {
        createConfirmWindow("Only images will be uploaded! \n Do you wish to proceed?", executeUpload)
    }
}

async function executeUpload() {
    if (imagesToUpload.length > 0) {
        maxPhotos += imagesToUpload.length
        changeStatus("uploading", "Uploading photo " + uploadedPhotosCounter + "/" + maxPhotos)
        for (const file of imagesToUpload) {
            await sendFile(file)
        }
    }
}

async function sendFile(file) {
    const data = new FormData()
    data.append("photo", file)
    let url = "/eforce-gallery/gallery-manager/photos/upload"
    if (galleryID !== "") {
        url += "?galleryID=" + galleryID
    }
    const response = await fetch(url, {
        method: "post",
        body: data
    })
    const message = (await response.json()).message
    if (message === "ok") {
        uploadedPhotosCounter++
        if(uploadedPhotosCounter <= maxPhotos){
            changeStatus("uploading", "Uploading photo " + uploadedPhotosCounter + "/" + maxPhotos)
        }else{
            changeStatus("done", maxPhotos + " photos uploaded")
        }
    }
}

function getOnlyImages(files) {
    const images = []
    let allImages = true
    const fileTypes = new Set(["gif", "jpg", "jpeg", "png", "raw", "bmp"])
    for (const file of files) {
        const splitted = file.name.split(".")
        if (fileTypes.has(splitted[1])) {
            images.push(file)
        } else {
            allImages = false
        }
    }
    return {
        allImages: allImages,
        images: images
    }
}

export {
    createUploadWindow,
    getOnlyImages
}
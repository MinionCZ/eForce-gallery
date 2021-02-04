import {
    deleteSelected,
    downloadSelectedPhotos
} from "./requests.js"

/*
generates download buttons
*/
function generateDownloadButton(text, version, size, selectedPhotos, root) {
    const downloadButton = document.createElement("button")
    if (version === "lite") {
        downloadButton.setAttribute("class", "download-selection-button download-right")
    } else {
        downloadButton.setAttribute("class", "download-selection-button download-left")
    }
    downloadButton.innerHTML = text + size
    console.log(selectedPhotos.photos)
    downloadButton.onclick = () => {
        downloadSelectedPhotos(selectedPhotos.photos, selectedPhotos.allSelected, version, [])
        document.body.removeChild(root)
    }
    return downloadButton
}
/*
builds download layout
*/

function buildDownloadLayout(selectedPhotos, size) {
    const root = document.createElement("div")
    root.onclick = () => {
        document.body.removeChild(root)
    }
    root.setAttribute("class", "root")
    const downloadDiv = document.createElement("div")
    downloadDiv.setAttribute("class", "download-div")
    const downloadLite = generateDownloadButton("Download lite version <br> Size ~ ", "lite", size.liteSize, selectedPhotos, root)
    const downloadFull = generateDownloadButton("Download full version <br> Size ~ ", "full", size.fullSize, selectedPhotos, root)

    const titleDiv = document.createElement("div")
    titleDiv.setAttribute("class", "title-download-div")
    titleDiv.innerHTML = "Choose option for download:"
    downloadDiv.appendChild(titleDiv)
    downloadDiv.appendChild(downloadFull)
    downloadDiv.appendChild(downloadLite)
    downloadDiv.appendChild(generateCancelButton(root))
    root.appendChild(downloadDiv)
    document.body.appendChild(root)
}

/*
generates button for dialog close, its cross for closing
*/

function generateCancelButton(root) {
    const cancelButton = document.createElement("button")
    cancelButton.textContent = "\u2715"
    cancelButton.setAttribute("class", "cancel-button")
    cancelButton.onclick = () => {
        document.body.removeChild(root)
    }
    return cancelButton
}
/*
builds delete layout for confirmation of deleting photos
*/
function buildDeleteLayout(photosCount, selectedPhotos) {
    const root = document.createElement("div")
    root.setAttribute("class", "root")
    root.onclick = () => {
        if (document.body.contains(root)) {
            document.body.removeChild(root)
        }
    }
    const deleteDiv = document.createElement("div")
    deleteDiv.setAttribute("class", "download-div")
    const titleDiv = document.createElement("div")
    titleDiv.setAttribute("class", "title-download-div")
    titleDiv.innerHTML = "Do you really wish to delete " + photosCount + ((photosCount === 1) ? " photo?" : " photos?")
    const deleteButton = generateButton("", "right delete-button", "Delete")
    const cancelButton = generateButton("", "left cancel-delete-button", "Cancel")
    deleteButton.onclick = () => {
        deleteSelected(selectedPhotos.photos, selectedPhotos.allSelected)
        document.body.removeChild(root)
    }
    cancelButton.onclick = () => {
        document.body.removeChild(root)
    }
    root.appendChild(deleteDiv)
    deleteDiv.appendChild(titleDiv)
    deleteDiv.appendChild(deleteButton)
    deleteDiv.appendChild(cancelButton)
    deleteDiv.appendChild(generateCancelButton(root))
    document.body.appendChild(root)
}
/*
function with 3 params for generating layout
params are optional, so empty button can be generated
*/

function generateButton(id = "", cssClass = "", text = "") {
    const button = document.createElement("button")
    if (id !== "") {
        button.setAttribute("id", id)
    }
    if (cssClass !== "") {
        button.setAttribute("class", cssClass)
    }
    button.textContent = text
    return button

}

/*
creates popup window with settable time and text
good for informing user, 3 second is default time 
*/

async function createPopupWindow(text, time = 3000){
    const popup = document.createElement("div")
    popup.setAttribute("id", "popup")
    popup.setAttribute("class", "popup")
    const textDiv = document.createElement("div")
    textDiv.innerHTML = text
    textDiv.setAttribute("class", "popup-text-div")
    popup.appendChild(textDiv)

    popup.style.width = (text.length + 10) + "ch"
    popup.style.right = "calc(50% - " + (text.length+10)/2   + "ch)"
    const previousPopup = document.getElementById("popup")
    if(previousPopup !== null){
        document.body.removeChild(previousPopup)
    }
    document.body.appendChild(popup)

    setTimeout(() => {
        if(document.body.contains(popup)){
            document.body.removeChild(popup)
        }
    }, time)
}

export {
    buildDownloadLayout,
    buildDeleteLayout,
    createPopupWindow
}
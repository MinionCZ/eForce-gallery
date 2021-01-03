import{
    getPage
} from "../photos/pageHandler.js"
import {
    CheckStore
} from '../photos/checkStore.js'
import{
    PhotosStore
}from "../photos/photosStore.js"

/*
generates root element for photo preview
*/
function generateRootElement() {
    const root = document.createElement("div")
    root.setAttribute("id", "root")
    root.setAttribute("class", "root")
    root.onclick = (event) => {
        if (document.body.contains(root)) {
            if (event.target.id === "root" || event.target.id === "photoDiv") {
                document.body.removeChild(root)
            }
        }
    }
    return root
}

/*
generates side buttons for photo changing next/previous
 */
function generateSideButtons(leftCallback, rightCallback) {
    const leftButton = document.createElement("button")
    const rightButton = document.createElement("button")
    leftButton.setAttribute("class", "left photo-button")
    leftButton.textContent = "<"
    rightButton.setAttribute("class", "right photo-button")
    rightButton.textContent = ">"
    leftButton.onclick = () => {
        leftCallback()
    }
    rightButton.onclick = () => {
        rightCallback()
    }

    return {
        leftButton: leftButton,
        rightButton: rightButton
    }
}

/*
generates button for leaving photo preview
*/
function generateExitButton(root) {
    const exitButton = document.createElement("button")
    exitButton.textContent = "\u2715"
    exitButton.setAttribute("class", "exit-button")
    exitButton.onclick = () => {
        if (document.body.contains(root)) {
            document.body.removeChild(root)
            console.log(root)
        }
    }
    return exitButton
}

/*
generates button for communication with backend 
here it will generate delete button and download button, which will communicate with server
for downloading is trough callback set version which will be downloaded
for deleting there is no version, all will be deleted
*/
function generateBackendButton(filename, callback, cssClass, text, title, version = "") {
    const button = document.createElement("button")
    button.setAttribute("class", cssClass)
    button.textContent = text
    button.title = title
    button.value = version
    button.onclick = () => {
        if (version === "") {
            callback(filename)
        } else {
            callback(filename, version)
        }

    }
    return button
}
/*
generates top line of buttons
*/
function generateTopLine(filename, callbackDownload, callbackDelete, root) {
    const div = document.createElement("div")
    div.setAttribute("class", "top-line-div")
    div.appendChild(generateBackendButton(filename, callbackDownload, "top-button download-full", "⟱", "download full version of photo", "full"))
    div.appendChild(generateBackendButton(filename, callbackDownload, "top-button download-lite", "⇓", "download lite version of photo", "lite"))
    div.appendChild(generateBackendButton(filename, callbackDelete, "top-button delete", "🗑", "delete photo", ""))
    div.appendChild(generateExitButton(root))
    return div
}

/*
generates photo template with fetched photo from backend
*/
function generatePhotoView(source = "") {
    const photoDiv = document.createElement("div")
    photoDiv.setAttribute("id", "photoDiv")
    const photo = document.createElement("img")
    photo.setAttribute("class", "photo bottom")
    photo.setAttribute("id", "photo")
    photo.setAttribute("src", source)
    photo.onload = () => {
        let newPhoto = document.createElement("img")
        newPhoto.setAttribute("class", "photo")
        newPhoto.src = source
        photoDiv.appendChild(newPhoto)
        photoDiv.removeChild(newPhoto)
    }
    photoDiv.setAttribute("class", "photo-div-preview")
    photoDiv.appendChild(photo)
    return photoDiv
}
/*
sets new photo to be previewed
*/
function setPhotoToPreview(photo) {
    document.getElementById("photo").src = photo.getImageLink()
    const checkbox = document.getElementById("previewCheckbox")
    checkbox.checked = photo.checkBox.checked
    checkbox.onclick = () => {
        photo.checkBox.checked = checkbox.checked
        if (checkbox.checked) {
            CheckStore.addCheckedPhoto(photo.fileName)
        } else {
            CheckStore.removeCheckedPhoto(photo.fileName)
        }
    }
}

function generateCheckBox(photo) {
    const checkbox = document.createElement("input")
    checkbox.setAttribute("type", "checkbox")
    checkbox.setAttribute("class", "preview-checkbox photo-checkbox")
    checkbox.setAttribute("id", "previewCheckbox")
    checkbox.checked = photo.checkBox.checked
    checkbox.onclick = () => {
        photo.checkBox.checked = checkbox.checked
        if (checkbox.checked) {
            CheckStore.addCheckedPhoto(photo.fileName)
        } else {
            CheckStore.removeCheckedPhoto(photo.fileName)
        }
    }
    return checkbox
}
/*
generates status bar with useful information such as:
    photo on page
    page
    lite and full size
*/




export {
    generateTopLine,
    generateRootElement,
    generateSideButtons,
    generatePhotoView,
    setPhotoToPreview,
    generateCheckBox,
}
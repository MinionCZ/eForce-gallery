const fileTypes = ["jpg", "png", "gif", "psd", "bmp", "jpeg", "eps", "raw"]
const goodFiles = []
let index = 0
window.onload = function () {
    let dropArea = document.getElementById("dragAndDropArea")
    if (dropArea) {
        dropArea.addEventListener("drop", handleDrop, false)
        dropArea.addEventListener("dragenter", handleDragging, false)
        dropArea.addEventListener("dragleave", handleDragLeave, false)
        dropArea.addEventListener("dragover", function (event) {
            event.preventDefault()
        })
    }

    function handleDragging(event) {
        event.preventDefault()
        dropArea.style["background-color"] = "#99CCFF"
    }

    function handleDragLeave(event) {
        event.preventDefault()
        dropArea.style["background-color"] = "lightgray"
    }

    function handleDrop(event) {
        event.preventDefault()
        let dt = event.dataTransfer
        let files = dt.files
        let badFiles = []
        dropArea.style["background-color"] = "lightgray"
        for (let file of files) {
            if (!isItImage(file.name)) {
                badFiles.push(file.name)
            } else {
                goodFiles.push(file)
            }
        }
        if (handleBadFiles(badFiles)) {
            sendDataToBackEnd(goodFiles)
        }

    }
}

function createRandomId() {
    let id = ""
    let chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    for (let i = 0; i < 64; i++) {
        id += chars[Math.floor(Math.random() * chars.length)]
    }
    return id
}

function sendDataToBackEnd(files) {
    let galleryId = createRandomId()
    console.log(files.length)
    sendFile(galleryId)
}

function sendFile(galleryId) {
    let xhr = new XMLHttpRequest()
    let formData = new FormData()
    document.cookie = "galleryId=" + galleryId
    xhr.responseType = "json"
    formData.append("photo", getNextPhoto())
    xhr.onload = function () {
        if (xhr.readyState === 4) {
            if (xhr.status === 202 && JSON.parse(xhr.response).status === "success") {
                if (hasPhotoNext()) {
                    sendFile(galleryId)
                }
            } else {
                console.log(JSON.parse(xhr.response))
            }
        }
    }
    xhr.open("POST", "/gallery/photos/upload")
    xhr.send(formData)
}


function handleBadFiles(badFiles) {
    let status = true
    if (badFiles.length > 0) {
        let stringOut = "Following files won't be uploaded because they are not images. Do you wish to proceed?\n"
        for (let badFile of badFiles) {
            stringOut += badFile + "\n"
        }
        status = confirm(stringOut)
    }
    return status
}

function isItImage(fileName) {
    let fileType = parseFileType(fileName)
    let isIn = false
    for (let element of fileTypes) {
        if (element == fileType) {
            isIn = true
            break
        }
    }
    return isIn
}

function parseFileType(fileName) {
    let length = fileName.length
    let fileType = ""
    for (let i = length; i >= 0; i--) {
        if (fileName.charAt(i) === '.') {
            break
        }
        fileType += fileName.charAt(i)
    }
    return reverseString(fileType)
}

function reverseString(stringToReverse) {
    let string = ""
    for (let i = stringToReverse.length; i >= 0; i--) {
        string += stringToReverse.charAt(i)
    }
    return string
}

function getNextPhoto() {
    let file = null
    if (index < goodFiles.length) {
        file = goodFiles[index]
        index++
    }
    return file
}

function hasPhotoNext() {
    return index < goodFiles.length
}
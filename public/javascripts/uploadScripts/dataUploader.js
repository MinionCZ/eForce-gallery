let goodFiles = []
let index = 0
let galleryId = createRandomId()
const fileTypes = ["jpg", "png", "gif", "psd", "bmp", "jpeg", "eps", "raw"]
let totalFilesUploaded = 0
let allFilesSum = 0

function createRandomId() {
    let id = ""
    let chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    for (let i = 0; i < 64; i++) {
        id += chars[Math.floor(Math.random() * chars.length)]
    }
    return id
}

function handleDataUpload(files) {
    index = 0
    let badFiles = []
    let goodFiles = []
    for (let file of files) {
        if (!isItImage(file.name)) {
            badFiles.push(file.name)
        } else {
            goodFiles.push(file)
        }
    }
    if (handleBadFiles(badFiles)) {
        if (goodFiles.length > 0) {
            allFilesSum += goodFiles.length
            sendDataToBackend(goodFiles, true)

        }
    }
}

function sendDataToBackend(files, gallery) {
    goodFiles = files
    if (gallery) {
        sendFileToGallery(galleryId)
    }

}

function sendFileToGallery(galleryId) {
    let xhr = new XMLHttpRequest()
    let formData = new FormData()
    document.cookie = "galleryId=" + galleryId
    xhr.responseType = "json"
    formData.append("photo", getNextPhoto())
    xhr.onload = function () {
        if (xhr.readyState === 4) {
            if (xhr.status === 202 && JSON.parse(xhr.response).status === "success") {
                if (hasPhotoNext()) {
                    sendFileToGallery(galleryId)
                    console.log("sending" + index)
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
        totalFilesUploaded++
        index++
        changeStateOfUpload()
    }
    return file
}

function hasPhotoNext() {
    return index < goodFiles.length
}

function changeStateOfUpload() {
    let fileStatus = document.getElementById("dataStatus")
    if (allFilesSum > 0) {
        if (allFilesSum === totalFilesUploaded) {
            fileStatus.style["background-color"] = "#00BC1B"
            fileStatus.innerHTML = allFilesSum + " files uploaded"

        } else {
            fileStatus.style["background-color"] = "orange"
            fileStatus.innerHTML = "uploading file " + totalFilesUploaded + "/" + allFilesSum
        }
    }

}
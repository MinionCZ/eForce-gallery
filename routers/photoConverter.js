const sharp = require("sharp")
const savingPath = "./photos/thumbnails/"
const loadingPath = "./photos/uploads/"
const fs = require('fs')
const gm = require("gm")
const path = require("path")
const photoDatabase = require("../databases/photoDatabase")

async function handleNewPhoto(fileName, galleryId, username) {
    let pathToPhoto = loadingPath + fileName
    const getThumbnailName = () => {
        let thumbnail = path.basename(fileName, path.extname(fileName))
        console.log(thumbnail)
        thumbnail += "-th" + path.extname(fileName)
        return thumbnail
    }
    const thumbnailName = getThumbnailName()
    gm(pathToPhoto).thumbnail(420, 280).write(savingPath + thumbnailName, function (err) {})
    gm(pathToPhoto).identify(function (err, value) {
        if (!err) {
            const height = value.size.height
            const width = value.size.width
            photoDatabase.insertTempPhoto(fileName, galleryId, username, width, height, thumbnailName)
        }
    })
}

function convertPhotoNameToThumbnail(photoName) {
    let names = photoName.split(".")
    return names[0] + "-th." + names[1]

}




module.exports = {
    handleNewPhoto,
    convertPhotoNameToThumbnail
}
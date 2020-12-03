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
        thumbnail += "-th" + path.extname(fileName)
        return thumbnail
    }
    const thumbnailName = getThumbnailName()
    gm(pathToPhoto).thumbnail(420, 280).write(savingPath + thumbnailName, function (err) {})
    gm(pathToPhoto).size(function (err, size) {
        if (!err) {
            const height = size.height
            const width = size.width
            console.log(size)
            photoDatabase.insertTempPhoto(fileName, galleryId, username, width, height, thumbnailName)
            createLitePhoto(pathToPhoto, fileName)
        }
    })
    
}

function convertPhotoNameToThumbnail(photoName) {
    let names = photoName.split(".")
    return names[0] + "-th." + names[1]
}
async function createLitePhoto(pathToPhoto, fileName) {
    const lite = __dirname + "/../photos/lite-photos/" + fileName
    let size = fs.statSync(pathToPhoto).size
    let sizeInMB = size/1000/1000
    if (sizeInMB < 2.0){
        fs.writeFileSync(lite, fs.readFileSync(pathToPhoto))
    }else{
                gm(pathToPhoto).resize(6144000, "@").write(lite, async (err) =>{
            if (err){
                size = fs.statSync(lite).size/1000/1000
                if (size > 2.0){
                    gm(lite).define("jpeg:extent=2mb").write(lite, () => {})
                }
            }

        })
    }
}





module.exports = {
    handleNewPhoto,
    convertPhotoNameToThumbnail
}
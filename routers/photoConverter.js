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
    gm(pathToPhoto).identify(function (err, value) {
        if (!err) {
            const height = value.size.height
            const width = value.size.width
            photoDatabase.insertTempPhoto(fileName, galleryId, username, width, height, thumbnailName)
            createLitePhoto(pathToPhoto, fileName, width, height)
        }
    })
    
}

function convertPhotoNameToThumbnail(photoName) {
    let names = photoName.split(".")
    return names[0] + "-th." + names[1]
}
async function createLitePhoto(pathToPhoto, fileName, width, height) {
    const lite = __dirname + "/../photos/lite-photos/" + fileName
    let size = fs.statSync(pathToPhoto).size
    let sizeInMB = size/1024/1024
    if (sizeInMB < 2.0){
        fs.writeFileSync(lite, fs.readFileSync(pathToPhoto))
    }else{
        gm(pathToPhoto).define("jpeg:extent=1.8mb").write(lite, async function (err){
            if (!err){
                console.log("calculating")
                let size = fs.statSync(lite).size/1000/1000
                if (size > 2.0){
                    let newStats = calculateNewSize(width, height, size)
                    gm(lite).resize(newStats.width,newStats.height).write(lite, function(){})
                }else{
                    console.log (err)
                }
            }
        })
    }
}



function calculateNewSize(width, height, sizeInMB){
    const ratio = width/height
    const sizeRation = sizeInMB / 1.8
    let newArea = width*height/sizeRation
    newArea /= ratio
    let newHeight = Math.sqrt(newArea)
    let newWidth = newHeight*ratio
    return {
        height: Math.floor(newHeight),
        width: Math.floor(newWidth)
    }



}



module.exports = {
    handleNewPhoto,
    convertPhotoNameToThumbnail
}
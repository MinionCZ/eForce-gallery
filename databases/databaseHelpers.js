const fs = require("fs")

function convertDateFromHTML(date) {
    let datePieces = date.split("-")
    return datePieces[2] + "." + datePieces[1] + "." + datePieces[0]
}

function convertDateToHTML(date) {
    let datePieces = date.split(".")
    return datePieces[2] + "-" + datePieces[1] + "-" + datePieces[0]
}

function getThumbnailFromFileName(fileName) {
    let filenames = fileName.split(".")
    return filenames[0] + "-th." + filenames[1]
}

function deletePhoto(photoName) {
    fs.unlinkSync("./photos/uploads/" + photoName)
    fs.unlinkSync("./photos/thumbnails/" + getThumbnailFromFileName(photoName))
    fs.unlinkSync("./photos/lite-photos/" + photoName)
    fs.unlinkSync("./photos/big-thumbnails/" + getThumbnailFromFileName(photoName))
}

async function deleteManyPhotos(photos) {
    for (const photo of photos) {
        deletePhoto(photo)
    }
}
function addStringToFileName(filename, string){
    const splittedFilename = filename.split(".")
    splittedFilename[0] += string
    return splittedFilename[0] + "." + splittedFilename[1]
}



module.exports = {
    convertDateToHTML,
    convertDateFromHTML,
    deletePhoto,
    getThumbnailFromFileName,
    deleteManyPhotos,
    addStringToFileName
}
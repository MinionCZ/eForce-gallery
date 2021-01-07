const fs = require("fs")
const charMap = new Map()
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
    if (typeof(photoName) === Object){
        photoName = photoName.fileName
    }
    console.log(photoName)
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
/*
returns string with only english chars
*/
function stringToEnglish(string){
    fillCharMap()
    let newString = ""
    for (const char of string){
        if (charMap.has(char)){
            newString += charMap.get(char)
        }else{
            newString += char
        }
    }
    return newString
}
/*
fills char map with czech and english chars if it is empty, else just ends
*/
function fillCharMap(){
    if (charMap.size === 0){
        const czechChars = "ÁáČčĎďĚěÉéÍíŇňÓóŘřŠšŤťÚúůÝýŽž"
        const enChars = "AaCcDdEeEeIiNnOoRrSsTtUuYyZz"
        for (let i = 0; i<enChars.length; i++){
            charMap.set(czechChars[i], enChars[i])
        }
    }
}



module.exports = {
    convertDateToHTML,
    convertDateFromHTML,
    deletePhoto,
    getThumbnailFromFileName,
    deleteManyPhotos,
    addStringToFileName,
    stringToEnglish
}
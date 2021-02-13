const fs = require("fs")
const charMap = new Map()
function convertDateFromHTML(date) {
    let datePieces = date.split("-")
    return datePieces[2] + "." + datePieces[1] + "." + datePieces[0]
}
/*
converts normal date to html form
*/
function convertDateToHTML(date) {
    let datePieces = date.split(".")

    if (datePieces[1].length === 1){
        datePieces[1] = "0" + datePieces[1]
    }
    if(datePieces[0].length === 1){
        datePieces[0] = "0" + datePieces[0]
    }

    return datePieces[2] + "-" + datePieces[1] + "-" + datePieces[0]
}

/*
creates thumbnail from file name
*/
function getThumbnailFromFileName(fileName) {
    let filenames = fileName.split(".")
    return filenames[0] + "-th." + filenames[1]
}

/*
deletes photo by name from disk
*/
function deletePhoto(photoName) {
    if (typeof(photoName) === Object){
        photoName = photoName.fileName
    }
    fs.unlinkSync("./photos/uploads/" + photoName)
    fs.unlinkSync("./photos/thumbnails/" + getThumbnailFromFileName(photoName))
    fs.unlinkSync("./photos/lite-photos/" + photoName)
    fs.unlinkSync("./photos/big-thumbnails/" + getThumbnailFromFileName(photoName))
}

/*
deletes multiple photos
*/
async function deleteManyPhotos(photos) {
    for (const photo of photos) {
        deletePhoto(photo)
    }
}
/*
adds string to file name
*/
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

function getTime() {
    let now = new Date()
    return now.getHours() + ":" + now.getMinutes() + ":" + now.getSeconds()
}
/*
get today date
*/

function getToday() {
    let now = new Date()
    let month = parseInt(now.getMonth()) + 1
    let monthString = "" + month
    if(month < 10){
        monthString = "0" + month
    }
    let date = "" + now.getDate()
    if(now.getDate() < 10){
        date = "0" + now.getDate()
    }
    return date + "." + monthString + "." + now.getFullYear()
}
/*
returns string as search param
*/
function stringToSearchParam(string) {
    const pieces = string.split(" ")
    let param = ""
    for(let i = 0; i < pieces.length; i++){
        param += pieces[i]
        if(i + 1 < pieces.length){
            param += "+"
        }
    }
    return param
}
/*
crops space on the end of string to prevent same strings
*/
function cropSpaces(string) {
    while (string.charAt(string.length - 1) === ' ' && string.length > 0) {
        string = string.slice(0, -1)
    }
    while(string.charAt(0) === ' ' && string.length > 0){
        string = string.substring(1)
    }
   return string
}
/*
params - array of strings that needs to be unificated
*/
function makeStringsInArrayUnique(array) {
    const newArray = []
    const usedStrings = new Set()
    for(let string of array){
        string = cropSpaces(string)
        if(!usedStrings.has(string)){
            newArray.push(string)
        }
    }
    return newArray
}



module.exports = {
    convertDateToHTML,
    convertDateFromHTML,
    deletePhoto,
    getThumbnailFromFileName,
    deleteManyPhotos,
    addStringToFileName,
    stringToEnglish,
    getTime,
    getToday,
    stringToSearchParam,
    cropSpaces,
    makeStringsInArrayUnique
}
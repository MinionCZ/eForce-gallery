const {
    now
} = require("lodash")
const mongoClient = require("mongodb")
const {
    get
} = require("../routers/login")
let client = null
let collection = null
let tempCollection = null

function clientInitializer(clientInit) {
    client = clientInit
    collection = client.db("eForceGallery").collection("photos")
    tempCollection = client.db("eForceGallery").collection("tempPhotos")
}

function getTime() {
    now = new Date()
    return now.getHours() + ":" + now.getMinutes() + ":" + now.getSeconds()
}

function getExpirationTime() {
    let now = new Date()
    let hours = now.getHours() + 10
    if (now.getHours() + 10 > 24) {
        hours = (now.getHours() + 10) % 24
    }
    return hours + ":" + now.getMinutes() + ":" + now.getSeconds()
}

async function insertTempPhoto(fileName, galleryId, username) {
    let tempPhoto = {
        fileName: fileName,
        galleryID: galleryId,
        username: username,
        expiresIn: getExpirationTime()
    }
    await tempCollection.insertOne(tempPhoto)
}


module.exports = {
    clientInitializer,
    insertTempPhoto
}
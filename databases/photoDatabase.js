const mongoClient = require("mongodb")
const databaseHelper = require("./databaseHelpers")
let client = null
let collection = null
let tempCollection = null
let galleries = null

function clientInitializer(clientInit) {
    client = clientInit
    collection = client.db("eForceGallery").collection("photos")
    tempCollection = client.db("eForceGallery").collection("tempPhotos")
    galleries = client.db("eForceGallery").collection("galleries")
}

function getTime() {
    let now = new Date()
    return now.getHours() + ":" + now.getMinutes() + ":" + now.getSeconds()
}

function getToday() {
    let now = new Date()
    let month = parseInt(now.getMonth()) + 1
    return now.getDate() + "." + month + "." + now.getFullYear()
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
async function getTempPhotosByGalleryId(galleryId) {
    let allTempPhotos = await tempCollection.find({
        galleryID: galleryId
    }).toArray()
    return allTempPhotos
}

async function generateUniqueGalleryID() {
    let generate = function () {
        const chars = "0123456789abcdefghijklmnopgrstuvwxyz"
        let id = ""
        for (let i = 0; i < 32; i++) {
            id += chars[Math.floor(Math.random() * chars.length)]
        }
        return id
    }

    let generatedId = generate()
    while (await galleries.find({
            galleryID: generatedId
        }) === null) {
        generatedId = generate()
    }
    return generatedId

}


async function pushGalleryWithPhotos(tempGalleryId, galleryTitle, galleryLabel, tags, dateOfEvent, username) {
    let galleryPhotos = await getTempPhotosByGalleryId(tempGalleryId)
    let photoNames = []
    let newPhotos = []
    let today = getToday()
    let time = getTime()
    let galleryID = await generateUniqueGalleryID()
    const eventDate = databaseHelper.convertDateFromHTML(dateOfEvent)

    for (let photo of galleryPhotos) {
        photoNames.push(photo.fileName)
    }

    const gallery = {
        galleryID: galleryID,
        galleryTitle: galleryTitle,
        galleryLabel: galleryLabel,
        tags: tags,
        dateOfEvent: eventDate,
        nameOfContributor: username,
        lastChanges: today,
        lastChangesTime: time,
        photos: photoNames
    }

    await galleries.insertOne(gallery)

    for (let photo of galleryPhotos) {
        newPhotos.push({
            galleryID: galleryID,
            galleryTitle: galleryTitle,
            tags: tags,
            dateOfChange: today,
            dateOfEvent: eventDate,
            fileName: photo.fileName
        })
    }
    await collection.insertMany(newPhotos)
}

module.exports = {
    clientInitializer,
    insertTempPhoto,
    pushGalleryWithPhotos
}
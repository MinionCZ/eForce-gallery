const databaseHelper = require("./databaseHelpers")
const fs = require("fs")
let client = null
let photos = null
let tempCollection = null
let galleries = null

/*
initialize client
*/

function clientInitializer(clientInit) {
    client = clientInit
    photos = client.db("eForceGallery").collection("photos")
    tempCollection = client.db("eForceGallery").collection("tempPhotos")
    galleries = client.db("eForceGallery").collection("galleries")
}

/*
returns time
*/


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
    return now.getDate() + "." + month + "." + now.getFullYear()
}
/*
inserts temp photo into the database after receiving it from user
*/


async function insertTempPhoto(fileName, galleryId, username, width, height, thumbnailName) {
    let tempPhoto = {
        fileName: fileName,
        galleryID: galleryId,
        username: username,
        width: width,
        height: height,
        thumbnail: thumbnailName,
        expirationCounter: 0
    }
    await tempCollection.insertOne(tempPhoto)
}
/*
returns array of temp photos matching gallery ID
*/

async function getTempPhotosByGalleryId(galleryId) {
    let allTempPhotos = await tempCollection.find({
        galleryID: galleryId
    }).toArray()
    return allTempPhotos
}

/*
generates ID for gallery
*/
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

/*
pushes new gallery with new photos to database
*/
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
        contributionDate: today,
        photos: photoNames
    }

    await galleries.insertOne(gallery)
    for (let photo of galleryPhotos) {
        galleryTitles = []
        galleryTitles.push(galleryTitle)
        galleryIDs = []
        galleryIDs.push(galleryID)
        newPhotos.push({
            galleryIDs: galleryIDs,
            galleryTitles: galleryTitles,
            tags: tags,
            dateOfContribution: today,
            dateOfEvent: eventDate,
            width: photo.width,
            height: photo.height,
            fileName: photo.fileName,
            fullSizeInMB: fs.statSync(__dirname + "/../photos/uploads/" + photo.fileName).size/1000/1000,
            liteSizeInMB: -1000
            })
    }
    await photos.insertMany(newPhotos)
    deleteTempPhotos(photoNames)
    setTimeout(() =>{getLiteSizes(galleryPhotos)}, 5000)
}


async function getLiteSizes(photosToGetSize){
    const path = __dirname + "/../photos/lite-photos/"
    console.log("runs")
    const newPhotoList = []
    for (const photo of photosToGetSize){
        if (fs.existsSync(path + photo.fileName)){
            await photos.updateOne({fileName:photo.fileName}, {
                $set:{
                    liteSizeInMB: fs.statSync(path + photo.fileName).size/1000/1000
                }
            })
        }else{
            newPhotoList.push(photo)
        }
    }
    if (newPhotoList.length !== 0){
        setTimeout(() =>{getLiteSizes(newPhotoList)}, 5000)
    }
}



/*
deletes temp photos
*/
async function deleteTempPhotos(fileNames) {
    await tempCollection.deleteMany({
        fileName: {
            $in: fileNames
        }
    })
}
/*
pushes new gallery without photos to database
*/

async function pushGalleryWithoutPhotos(galleryTitle, galleryLabel, tags, eventDate, username) {
    let today = getToday()
    let time = getTime()
    let galleryID = await generateUniqueGalleryID()
    const gallery = {
        galleryID: galleryID,
        galleryTitle: galleryTitle,
        galleryLabel: galleryLabel,
        tags: tags,
        dateOfEvent: eventDate,
        nameOfContributor: username,
        lastChanges: today,
        lastChangesTime: time,
        contributionDate: today,
        photos: []
    }
    await galleries.insertOne(gallery)
}

/*
returns all galleries, which are then send to frontend
*/
async function getAllGalleries() {
    const galleriesFromDatabase = await galleries.find({}).toArray()
    const galleriesToFrontEnd = []
    for (const gallery of galleriesFromDatabase) {
        let newGallery = {
            title: gallery.galleryTitle,
            galleryID: gallery.galleryID,
            tags: gallery.tags,
            eventDate: gallery.dateOfEvent,
            contributor: gallery.nameOfContributor,
            lastChanges: gallery.lastChanges,
            label: gallery.galleryLabel,
            photos: gallery.photos.length,
            contributionDate: gallery.contributionDate
        }
        galleriesToFrontEnd.push(newGallery)
    }
    return galleriesToFrontEnd
}

/*
clears temporary gallery periodically, here are saved photos, which are waiting for gallery to be submitted
*/

function clearTempGallery() {
    setInterval(async function () {
        let tempPhotos = await tempCollection.find().toArray()
        if (tempPhotos.length !== 0) {
            for (const photo of tempPhotos) {
                if (photo.expirationCounter === 20) {
                    tempCollection.deleteOne({
                        fileName: photo.fileName
                    })
                    databaseHelper.deletePhoto(photo.fileName)
                } else {
                    let expirationCounter = photo.expirationCounter + 1
                    tempCollection.updateOne({
                        fileName: photo.fileName
                    }, {
                        $set: {
                            expirationCounter: expirationCounter
                        }
                    })
                }
            }
        }
    }, 1000 * 60 * 60)
}

/*
finds gallery by id
*/

async function findGalleryByID(galleryID) {
    let gallery = await galleries.findOne({
        galleryID: galleryID
    })
    return gallery
}



module.exports = {
    clientInitializer,
    insertTempPhoto,
    pushGalleryWithPhotos,
    pushGalleryWithoutPhotos,
    getAllGalleries,
    clearTempGallery,
    findGalleryByID,
    ...require("./galleryModifier"),
    ...require("./photoGetters")
}
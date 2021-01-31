const databaseHelper = require("./databaseHelpers")
const fs = require("fs")
let client = null
let photos = null
let galleries = null

/*
init function
*/
function galleryModifierInit(clientInit) {
    client = clientInit
    photos = client.db("eForceGallery").collection("photos")
    galleries = client.db("eForceGallery").collection("galleries")
}

/*
updates photo, mainly gallery titles and ids when they are erased
*/
async function updatePhoto(fileName, galleryID, add) {
    const gallery = await findGalleryByID(galleryID)
    const galleryTitles = gallery.galleryTitles
    const galleryIDs = gallery.galleryIDs
    if (add) {
        galleryIDs.push(galleryID)
        galleryTitles.push(gallery.galleryTitle)
    } else {
        let index = galleryIDs.indexOf(galleryID)
        galleryIDs.splice(index, 1)
        galleryTitles.splice(index, 1)
    }
    photos.updateOne({
        fileName: fileName
    }, {
        $set: {
            galleryIDs: galleryIDs,
            galleryTitles: galleryTitles
        }
    })
}
/*
returns photo from db by its file name
*/

async function findPhotoByFileName(fileName) {
    return await photos.findOne({
        fileName: fileName
    })
}
/*
delete photos from db and from disk
param clearInDatabase is optional and useable, when only photos are selected
*/

async function deletePhotos(photosToDelete, clearInDatabase = false) {
    databaseHelper.deleteManyPhotos(photosToDelete)
    
    if (clearInDatabase){
        const deleteMap = await getGalleriesToClear(photosToDelete)
        for (const gallery of deleteMap){
            deletePhotosFromGallery(gallery[0], gallery[1])
        }
    }
    photos.deleteMany({
        fileName: {
            $in: photosToDelete
        }
    })
}

/*
creates map with databases and their photos which are going to be deleted and in which galleries they are
*/
async function getGalleriesToClear(photosToDelete){
    const deleteDatabaseMap = new Map()
    for (const filename of photosToDelete){
        const photo = await findPhotoByFileName(filename)
        for (const database of photo.galleryTitles){
            if (!deleteDatabaseMap.has(database)){
                deleteDatabaseMap.set(database, [])
                deleteDatabaseMap.get(database).push(filename)
            }else{
                deleteDatabaseMap.get(database).push(filename)
            }
        }
    }
    return deleteDatabaseMap
}

/*
delete photos from galleries, clears their existence in photo list
*/
async function deletePhotosFromGallery(galleryTitle, photos){
    const gallery = await galleries.findOne({galleryTitle : galleryTitle})
    const galleryPhotos = new Set(gallery.photos)
    for (const photo of photos){
        galleryPhotos.delete(photo)
    }
    await galleries.updateOne({galleryTitle:galleryTitle}, {
        $set:{
            photos:Array.from(galleryPhotos)
        }
    })
    syncGallerySizes(gallery.galleryID)
}





/*
deletes gallery by her id
*/
async function deleteGalleryByID(galleryID) {
    const gallery = await galleries.findOne({
        galleryID: galleryID
    })
    galleries.deleteOne({
        galleryID: galleryID
    })
    const photosToDelete = []
    for (let fileName of gallery.photos) {
        const photo = await findPhotoByFileName(fileName)
        if (photo.galleryIDs.length > 1) {
            updatePhoto(photo, gallery.galleryID, gallery.galleryTitle)
        } else {
            photosToDelete.push(fileName)
        }
    }
    deletePhotos(photosToDelete)
}

/*
auto sync gallery with photo size sum, can be called with or without param with param sync only that gallery not all, sync every 24h
 */
async function syncGallerySizes(galleryID = "") {
    if (galleryID === "") {
        const galleriesToSync = await galleries.find().toArray()
        for (const gallery of galleriesToSync) {
            if (gallery.photos.length > 0) {
                const size = calculateSizeOfGallery(gallery)
                await galleries.updateOne({
                    galleryID: gallery.galleryID
                }, {
                    $set: {
                        fullSizeInMB: size.fullSize,
                        liteSizeInMB: size.liteSize
                    }
                })
            }
        }
    }else{
        const galleryToSync = await galleries.findOne({galleryID:galleryID})
        const size = calculateSizeOfGallery(galleryToSync)
        await galleries.updateOne({
            galleryID: galleryToSync.galleryID
        }, {
            $set: {
                fullSizeInMB: size.fullSize,
                liteSizeInMB: size.liteSize
            }
        })
    }
}

/*
calculates size of gallery by summing its image sizes
*/
function calculateSizeOfGallery(gallery) {
    let fullSize = 0
    let liteSize = 0
    const fullPath = __dirname + "/../photos/uploads/"
    const litePath = __dirname + "/../photos/lite-photos/"
    for (const photo of gallery.photos) {
        if (fs.existsSync(fullPath + photo)) {
            fullSize += fs.statSync(fullPath + photo).size / 1000 / 1000
        }
        if (fs.existsSync(litePath + photo)) {
            liteSize += fs.statSync(litePath + photo).size / 1000 / 1000
        }
    }
    return {
        fullSize: fullSize,
        liteSize: liteSize
    }
}
setInterval(syncGallerySizes, 24 * 60 * 60 * 1000)

async function getGalleryByTitle(title){
    const gallery = await galleries.findOne({galleryTitle: title})
    gallery.contributionDate = databaseHelper.convertDateToHTML(gallery.contributionDate)
    gallery.dateOfEvent = databaseHelper.convertDateToHTML(gallery.dateOfEvent)
    return gallery
}





module.exports = {
    deleteGalleryByID,
    galleryModifierInit,
    updatePhoto,
    syncGallerySizes,
    deletePhotos,
    getGalleryByTitle
}
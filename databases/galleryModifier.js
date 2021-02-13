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

    if (clearInDatabase) {
        const deleteMap = await getGalleriesToClear(photosToDelete)
        for (const gallery of deleteMap) {
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
async function getGalleriesToClear(photosToDelete) {
    const deleteDatabaseMap = new Map()
    for (const filename of photosToDelete) {
        const photo = await findPhotoByFileName(filename)
        for (const database of photo.galleryTitles) {
            if (!deleteDatabaseMap.has(database)) {
                deleteDatabaseMap.set(database, [])
                deleteDatabaseMap.get(database).push(filename)
            } else {
                deleteDatabaseMap.get(database).push(filename)
            }
        }
    }
    return deleteDatabaseMap
}

/*
delete photos from galleries, clears their existence in photo list
*/
async function deletePhotosFromGallery(galleryTitle, photos) {
    const gallery = await galleries.findOne({ galleryTitle: galleryTitle })
    const galleryPhotos = new Set(gallery.photos)
    for (const photo of photos) {
        galleryPhotos.delete(photo)
    }
    await galleries.updateOne({ galleryTitle: galleryTitle }, {
        $set: {
            photos: Array.from(galleryPhotos)
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
    } else {
        const galleryToSync = await galleries.findOne({ galleryID: galleryID })
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

/*
gets gallery by title
*/
async function getGalleryByTitle(title) {
    const gallery = await galleries.findOne({ galleryTitle: title })
    gallery.contributionDate = databaseHelper.convertDateToHTML(gallery.contributionDate)
    gallery.dateOfEvent = databaseHelper.convertDateToHTML(gallery.dateOfEvent)
    return gallery
}

/*
updates gallery with information from frontend
*/
async function updateGallery(galleryToUpdate) {
    await galleries.updateOne({ galleryID: galleryToUpdate.galleryID }, {
        $set: {
            galleryTitle: databaseHelper.cropSpaces(galleryToUpdate.title),
            galleryLabel: databaseHelper.cropSpaces(galleryToUpdate.label),
            dateOfEvent: databaseHelper.convertDateFromHTML(galleryToUpdate.eventDate),
            lastChanges: databaseHelper.getToday(),
            lastChangesTime: databaseHelper.getTime(),
            photos: galleryToUpdate.photos,
            tags: databaseHelper.makeStringsInArrayUnique(galleryToUpdate.tags)
        }
    })


}
/*
returns all tags
*/

async function getAllTags() {
    const tagSet = new Set()
    const allGalleries = await galleries.find({}).toArray()
    for (const gallery of allGalleries) {
        for (const tag of gallery.tags) {
            tagSet.add(tag)
        }
    }
    return Array.from(tagSet)
}
/*
adds photo to primary photo database - to database photos
*/
async function addPhotoToPrimaryDatabase(filename, width, height, fullSizeInMB) {
    const photo = {
        galleryIDs: [],
        galleryTitles: [],
        tags: [],
        dateOfContribution: databaseHelper.getToday(),
        dateOfEvent: "01.01.0000",
        width: width,
        height: height,
        fileName: filename,
        fullSizeInMB: fullSizeInMB,
        liteSizeInMB: -1000
    }
    await photos.insertOne(photo)
}

/*
adds photo to gallery after adding it to photo database
*/

async function addPhotoToGallery(galleryID, photoName) {
    const gallery = await galleries.findOne({ galleryID: galleryID })
    gallery.photos.push(photoName)
    await galleries.updateOne({ galleryID: galleryID }, {
        $set: {
            photos: gallery.photos
        }
    })
    const photo = await photos.findOne({ fileName: photoName })
    photo.galleryIDs.push(galleryID)
    photo.galleryTitles.push(gallery.galleryTitle)
    await photos.updateOne({ fileName: photoName }, {
        $set: {
            galleryIDs: photo.galleryIDs,
            galleryTitles: photo.galleryTitles,
            dateOfEvent: gallery.dateOfEvent,
            tags: makeTagsUnique(photo.tags, gallery.tags)
        }
    })
}
/*
makes tags unique, deletes all duplicits
*/
function makeTagsUnique(oldTags, newTags) {
    const allTags = new Set(oldTags)
    for (const tag of newTags) {
        allTags.add(tag)
    }
    return Array.from(allTags)
}

/*
links photos to gallery by its title
also prevents from bad galery title
*/
async function linkPhotosToGallery(photosToLink, allSelected, galleryTitle) {
    const gallery = await galleries.findOne({ galleryTitle: galleryTitle })
    if (gallery === null) {
        return "Not a valid gallery"
    }
    photosToLink = await getSelectedPhotos(photosToLink, allSelected)
    const photosInGallery = new Set(gallery.photos)
    let allreadyInsideCounter = 0
    let addedPhotos = 0
    for (const photo of photosToLink) {
        if (photosInGallery.has(photo)) {
            allreadyInsideCounter++
        } else {
            gallery.photos.push(photo)
            addedPhotos++
        }
    }

    await galleries.updateOne({ galleryTitle: galleryTitle }, {
        $set: {
            photos: gallery.photos
        }
    })
    await syncGallerySizes(gallery.galleryID)

    if (allreadyInsideCounter === 0) {
        return "All " + addedPhotos + " were succesfully added to " + galleryTitle
    } else if (allreadyInsideCounter > 0 && addedPhotos > 0) {
        return addedPhotos + " were succesfully added to " + galleryTitle + " " + allreadyInsideCounter + " were already inside gallery"
    } else {
        return "Any of " + allreadyInsideCounter + " photos were added to gallery because, they are already inside"
    }
}
/*
gets selected photos 
if photos are selected as extracted then will return all photos without this extracted ones
else returns the same array that it received
*/
async function getSelectedPhotos(photosToLink, allSelected) {
    if (!allSelected) {
        return photosToLink
    }
    const allPhotos = await photos.find().toArray()
    const photosToReturn = []
    const extractedPhotos = new Set(photosToLink)
    for (const photo of allPhotos) {
        if (!extractedPhotos.has(photo.fileName)) {
            photosToReturn.push(photo.fileName)
        }
    }
    return photosToReturn
}



module.exports = {
    deleteGalleryByID,
    galleryModifierInit,
    updatePhoto,
    syncGallerySizes,
    deletePhotos,
    getGalleryByTitle,
    updateGallery,
    getAllTags,
    deletePhotosFromGallery,
    addPhotoToPrimaryDatabase,
    addPhotoToGallery,
    linkPhotosToGallery
}
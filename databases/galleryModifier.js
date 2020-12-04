const databaseHelper = require("./databaseHelpers")
let client = null
let photos = null
let tempCollection = null
let galleries = null

function galleryModifierInit(clientInit) {
    client = clientInit
    photos = client.db("eForceGallery").collection("photos")
    tempCollection = client.db("eForceGallery").collection("tempPhotos")
    galleries = client.db("eForceGallery").collection("galleries")
}

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
            galleryIDs:galleryIDs,
            galleryTitles:galleryTitles
        }
    })
}

async function findPhotoByFileName(fileName){
    return await photos.findOne({fileName:fileName})
}

async function deletePhotos(photosToDelete){
    databaseHelper.deleteManyPhotos(photosToDelete)
    photos.deleteMany({fileName : {$in: photosToDelete}})
}



async function deleteGalleryByID(galleryID){
    const gallery = await galleries.findOne({galleryID:galleryID})
    galleries.deleteOne({galleryID:galleryID})
    const photosToDelete = []
    for (let fileName of gallery.photos){
        const photo = await findPhotoByFileName(fileName)
        if (photo.galleryIDs.length > 1){
            updatePhoto(photo, gallery.galleryID, gallery.galleryTitle)
        }else{
            photosToDelete.push(fileName)
        }
    }
    deletePhotos(photosToDelete)
}




module.exports = {
    deleteGalleryByID,
    galleryModifierInit,
    updatePhoto
}
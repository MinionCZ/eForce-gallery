const databaseHelper = require("./databaseHelpers")
let client = null
let photos = null
let tempCollection = null
let galleries = null

/*
initialize client
*/

function initPhotoGetters(clientInit) {
    photos = clientInit.db("eForceGallery").collection("photos")
    galleries = clientInit.db("eForceGallery").collection("galleries")
}
/*
return array of photos by page and count of photos on this page, this is from unfiltered photos collection
*/

async function getUnfilteredPhotos(page, photosPerPage){
    const allPhotos = await photos.find().toArray()
    return getPhotosToPage(page, photosPerPage, allPhotos)
}

/*
adds additional information for front end currently only maximum of photos
*/
function addWrapperToResponse(count, photos){
    return {
        photosCount: count,
        photos:photos
    }

}



function getPhotosToPage(page, photosPerPage, photos){
    const photosToReturn = []
    if(photos.length <= page * photosPerPage){
        for (let i = (page - 1) * photosPerPage; i < page * photosPerPage; i++){
            photosToReturn.push(photos[i])
        }
    }else if (photos.length <= (page - 1) * photosPerPage){
        for (let i = (page - 1); i < photos.length; i++){
            photosToReturn.push(photos[i])
        }
    }
    return addWrapperToResponse(photos.length, photosToReturn)
}


/*
this function filters photos by tags, serves as main function for photos service to front end
*/

async function filterPhotosByTags(tags, page, photosPerPage){
    if(tags.length == 0){
        return await getUnfilteredPhotos(page, photosPerPage)
    }
    if(tags.length === 1 && tags[0] === "#without-tags-photos"){
        const tagLessPhotos = await photos.find({tags: {$exists : true, $size: 0}}).toArray()
        return getPhotosToPage(page, photosPerPage, tagLessPhotos)
    }
    const multipleTags = photos.find({tags: {$exists: true, $all: tags}})
    return getPhotosToPage(page, photosPerPage, multipleTags)
}



module.exports = {
    initPhotoGetters,
    filterPhotosByTags
}
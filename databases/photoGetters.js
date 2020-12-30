const databaseHelper = require("./databaseHelpers")
let photos = null
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

async function getUnfilteredPhotos(page, photosPerPage) {
    const allPhotos = await photos.find().toArray()
    return getPhotosToPage(page, photosPerPage, allPhotos)
}

/*
adds additional information for front end currently only maximum of photos
*/
function addWrapperToResponse(count, photos, fullSize, liteSize) {
    return {
        photosCount: count,
        photos: photos,
        fullSize: fullSize,
        liteSize: liteSize
    }

}


/*
returns exact photos for current page
*/
function getPhotosToPage(page, photosPerPage, photos) {
    const photosToReturn = []
    if (photos.length >= page * photosPerPage) {
        for (let i = (page - 1) * photosPerPage; i < page * photosPerPage; i++) {
            photosToReturn.push(photos[i])
        }
    } else if (photos.length >= (page - 1) * photosPerPage) {
        for (let i = (page - 1)*photosPerPage; i < photos.length; i++) {
            photosToReturn.push(photos[i])
        }
    }
    const size = calculateSizeOfPhotoArray(photos)
    return addWrapperToResponse(photos.length, photosToReturn, size.fullSize, size.liteSize)
}


/*
this function filters photos by tags, serves as main function for photos service to front end
*/

async function filterPhotosByTags(tags, page, photosPerPage) {
    if (tags.length == 0) {
        return await getUnfilteredPhotos(page, photosPerPage)
    }
    if (tags.length === 1 && tags[0] === "#without-tags-photos") {
        const tagLessPhotos = await photos.find({
            tags: {
                $exists: true,
                $size: 0
            }
        }).toArray()
        return getPhotosToPage(page, photosPerPage, tagLessPhotos)
    }
    const multipleTags = photos.find({
        tags: {
            $exists: true,
            $all: tags
        }
    })
    return getPhotosToPage(page, photosPerPage, multipleTags)
}

/*
calculates size of files on HDD and sends them to front end
*/
function calculateSizeOfPhotoArray(photos) {
    let liteSize = 0,
        fullSize = 0
    for (const photo of photos) {
        liteSize += photo.liteSizeInMB
        fullSize += photo.fullSizeInMB
    }
    return {
        liteSize: liteSize,
        fullSize: fullSize
    }
}

/*
returns all photos, possible argument to exclude some of them
second possible argument says if function returns all photos or, just their filenames
*/

async function getAllPhotos(excludedFilenames = [], onlyFileNames = false) {
    const allPhotos = await photos.find({}).toArray()
    if (excludedFilenames.length === 0) {
        if (onlyFileNames) {
            return getFileNamesFromPhotos(allPhotos)
        }
        return allPhotos
    } else {
        return getExcludedPhotos(allPhotos, excludedFilenames, onlyFileNames)
    }
}

/*
returns file of filenames from array of photo objects
*/
function getFileNamesFromPhotos(photos) {
    const photosToReturn = []
    for (const photo of photos) {
        photosToReturn.push(photo.fileName)
    }
    return photosToReturn
}

/*
returns array of photos without excluded ones, can return only filenames
 */

function getExcludedPhotos(photos, excludedFilenames, onlyFileNames = false) {
    const photosToReturn = []
    const excludedSet = new Set(excludedFilenames)
    for (const photo of photos) {
        if (!excludedSet.has(photo.fileName)) {
            if (onlyFileNames) {
                photosToReturn.push(photo.fileName)
            } else {
                photosToReturn.push(photo)
            }
        }
    }
    return photosToReturn
}







module.exports = {
    initPhotoGetters,
    filterPhotosByTags,
    getAllPhotos
}
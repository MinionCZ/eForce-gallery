const { request } = require('express')
const express = require('express')
const router = express.Router()
const photoDatabase = require("../databases/photoDatabase")
const { route } = require('./newGallery')


router.get("/eforce-gallery/photos", async function (request, response) {
    response.render("allPhotos.ejs")
})


/*
gets all photos on page
*/
router.get("/eforce-gallery/get-all-photos", async function (request, response){
    response.json(await photoDatabase.filterPhotosByTags([], request.query.page, request.query.photosPerPage))
})

/*
deletes photos in request
*/
router.post("/eforce-gallery/photos/delete", async function(request, response){
    let photosToDelete = request.body.photos
    if(request.body.allPhotos){
        photosToDelete = await photoDatabase.getAllPhotos(request.body.photos)
    }
    photoDatabase.deletePhotos(photosToDelete, true)
    const data = {
        deleted:  photosToDelete.length + ((photosToDelete.length === 1) ? " photo" : " photos") + " deleted"
    }
    response.json(data)
})

router.get("/eforce-gallery/photos/upload-new-photos", async(request, response) => {
    response.render("uploadPhotos.ejs")
})

router.post("/eforce-gallery/photos/link-photos-to-gallery", async(request, response) =>{
    const responseText = await photoDatabase.linkPhotosToGallery(request.body.photos, request.body.allSelected, request.body.galleryTitle)
    response.json({
        "status": responseText
    })
})

module.exports = router
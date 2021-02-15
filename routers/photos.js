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
router.post("/eforce-gallery/get-all-photos", async function (request, response){
    console.log(request.body)
    const page = request.body.page
    const galleries = request.body.galleries
    const tags = request.body.tags
    const tagsLogic = request.body.tagsState
    const galleryLogic = request.body.galleriesState
    if(galleries.length === 0 && tags.length === 0){
        response.json({photos : await photoDatabase.filterPhotosByTags([], page, 60)})
        console.log("hola")
    }else{
        response.json({photos : await photoDatabase.filterPhotosByQuery(tags, galleries, page, galleryLogic, tagsLogic)})
    }
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
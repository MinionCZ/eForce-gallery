const { json } = require('body-parser')
const { response, request } = require('express')
const express = require('express')
const router = express.Router()
const photoDatabase = require("../databases/photoDatabase")

/*
deletes gallery
*/
router.post('/eforce-gallery/delete/gallery', async (request, response) => {
    await photoDatabase.deleteGalleryByID(request.body.galleryID)
    response.redirect("/eforce-gallery/dashboard")
})

/*
renders page for gallery manager
*/
router.get("/eforce-gallery/gallery-manager", async function(request, response){
    response.render("galleryManager.ejs")
})

/*
sends json with information about gallery
*/
router.post("/eforce-gallery/fetch-gallery-by-title", async (request, response) =>{
    const data = await photoDatabase.getGalleryByTitle(request.body.title)
    response.json(data)

})

router.post("/eforce-gallery/gallery-manager/update-gallery", async (request, response) =>{
    await photoDatabase.updateGallery(request.body)
    const data = {
        message: "Gallery has been changed succesfully"
    }
    response.json(data)
})

router.get("/eforce-gallery/gallery-manager/get-all-tags", async (request, response) =>{
    response.json({tags: await photoDatabase.getAllTags()})
})

router.post("/eforce-gallery/gallery-manager/delete-photos-from-gallery", async (request, response) =>{
    const photosToDelete = request.body.photos
    const gallery = await photoDatabase.findGalleryByID(request.body.galleryID)
    await photoDatabase.deletePhotosFromGallery(gallery.galleryTitle, photosToDelete)
    response.json({
        "message" : photosToDelete.length +  " photos deleted"
    })
})
router.post("/eforce-gallery/gallery-manager/delete-gallery", async (request, response) => {
    await photoDatabase.deleteGalleryByID(request.body.galleryID)
    response.json({
        "message": "success"
    })

})



module.exports = {
    router
}
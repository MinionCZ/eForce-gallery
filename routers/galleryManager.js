const express = require('express')
const router = express.Router()
const photoDatabase = require("../databases/photoDatabase")

router.post('/eforce-gallery/delete/gallery', async (request, response) => {
    await photoDatabase.deleteGalleryByID(request.body.galleryID)
    response.redirect("/eforce-gallery/dashboard")
})

router.get("/eforce-gallery/gallery-manager", async function(request, response){
    response.render("galleryManager.ejs")
})


module.exports = {
    router
}
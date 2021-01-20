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
    console.log(data)
    response.json(data)

})


module.exports = {
    router
}
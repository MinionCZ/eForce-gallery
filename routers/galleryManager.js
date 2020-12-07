const express = require('express')
const router = express.Router()
const tokenVerifier = require("../verifiers/token")
const photoDatabase = require("../databases/photoDatabase")

router.post('/delete/gallery', async (request, response) => {
    let token = request.cookies.token
    if (!await tokenVerifier.isTokenValid(token, response)) {
        return
    }
    await photoDatabase.deleteGalleryByID(request.body.galleryID)
    response.redirect("/dashboard")
})



module.exports = {
    router
}
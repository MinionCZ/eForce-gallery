const express = require('express')
const router = express.Router()
const tokenVerifier = require("../verifiers/token")
const photoDatabase = require("../databases/photoDatabase")


router.get("/eforce-gallery/photos", async function (request, response) {
    let token = request.cookies.token
    if (!await tokenVerifier.isTokenValid(token, response)) {
        return
    }
    token = tokenVerifier.refreshToken(token, response)
    response.render("allPhotos.ejs")
})


/*

*/
router.get("/get-all-photos", async function (request, response){
    let token = request.cookies.token
    if (!await tokenVerifier.isTokenValid(token, response)) {
        return
    }
    token = tokenVerifier.refreshToken(token, response)
    response.json(await photoDatabase.filterPhotosByTags([], request.query.page, request.query.photosPerPage))
})

router.post("/photos/delete", async function(request, response){
    let token = request.cookies.token
    if (!await tokenVerifier.isTokenValid(token, response)) {
        return
    }
    token = tokenVerifier.refreshToken(token, response)
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




module.exports = router
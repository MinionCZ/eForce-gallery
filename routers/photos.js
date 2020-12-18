const express = require('express')
const router = express.Router()
const tokenVerifier = require("../verifiers/token")
const photoDatabase = require("../databases/photoDatabase")


router.get("/photos", async function (request, response) {
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
    response.json(await photoDatabase.filterPhotosByTags([], 1, 60))
})


module.exports = router
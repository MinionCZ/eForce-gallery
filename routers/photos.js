const express = require('express')
const router = express.Router()
const tokenVerifier = require("../verifiers/token")


router.get("/photos", async function (request, response) {
    let token = request.cookies.token
    if (!await tokenVerifier.isTokenValid(token, response)) {
        return
    }
    token = tokenVerifier.refreshToken(token, response)
    response.render("allPhotos.ejs")
})
module.exports = router
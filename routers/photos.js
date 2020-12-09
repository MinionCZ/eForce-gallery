const express = require('express')
const router = express.Router()
const tokenVerifier = require("../verifiers/token")


router.get("/photos", async function (request, response) {
    let token = request.cookies.token
    if (!await tokenVerifier.isTokenValid(token, response)) {
        return
    }
    token = tokenVerifier.refreshToken(token, response)
    console.log("hello")
    response.render("allPhotos.ejs")
})


router.get("/get-all-photos", async function (request, response){
    
})


module.exports = router
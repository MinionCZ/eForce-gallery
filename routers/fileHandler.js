const {
    request
} = require('express')
const express = require('express')
const router = express.Router()
const tokenVerifier = require("../verifiers/token")
const multer = require('multer');
const uploadPath = "./photos/uploads"
const path = require('path')
const fs = require('fs')

const storage = multer.diskStorage({
    destination: function (request, file, callback) {
        callback(null, uploadPath)
    },
    filename: function (request, file, callback) {
        callback(null, file.fieldname + "-" + Date.now() + path.extname(file.originalname)) //to do renaming
    }
})
const upload = multer({
    storage: storage
}).single("photo")

router.post("/gallery/photos/upload", async function (request, response) {
    let token = request.cookies.token
    if (!tokenVerifier.isTokenValid(token, response)) {
        return
    }
    tokenVerifier.refreshToken(token, response)
    let username = tokenVerifier.getUsernameFromToken(token)
    let galleryId = request.cookies.galleryId
    console.log(galleryId)
    upload(request, response, function (error) {
        if (error) {
            response.status(400)
            response.send("error status: bad file")
        } else {
            response.status(202)
            response.send("successfully uploaded")
        }
    })

})

module.exports = router
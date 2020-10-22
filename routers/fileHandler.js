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
const photoDatabase = require("../databases/photoDatabase")

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
    let username = tokenVerifier.getUsernameFromToken(token)
    let galleryId = request.cookies.galleryId

    upload(request, response, async function (error) {
        if (error) {
            response.status(400)
            response.json(JSON.stringify({
                status: "error"
            }))
        } else {
            await photoDatabase.insertTempPhoto("ahoj", galleryId, username)
            response.status(202)
            console.log(request)
            response.json(JSON.stringify({
                status: "success"
            }))

        }
    })

})

module.exports = router
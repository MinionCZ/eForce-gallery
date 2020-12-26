const express = require('express')
const router = express.Router()
const tokenVerifier = require("../verifiers/token")
const multer = require('multer');
const uploadPath = "./photos/uploads"
const path = require('path')
const fs = require('fs')
const photoDatabase = require("../databases/photoDatabase")
const PhotoConverter = require("./photoConverter")
const databaseHelpers = require("../databases/databaseHelpers")

const storage = multer.diskStorage({
    destination: function (request, file, callback) {
        callback(null, uploadPath)
    },
    filename: function (request, file, callback) {
        let generateId = () => {
            let chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
            let id = ""
            for (let i = 0; i < 16; i++) {
                id += chars[Math.floor(Math.random() * chars.length)]
            }
            return id
        }
        request.body.photoId = generateId() + "-" + Date.now() + "" + path.extname(file.originalname)

        callback(null, request.body.photoId)

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
            PhotoConverter.handleNewPhoto(request.body.photoId, galleryId, username)
            response.status(202)
            response.json(JSON.stringify({
                status: "success"
            }))

        }
    })

})

router.get("/photo-gallery/get-photo", async function (request, response) {
    let token = request.cookies.token
    if (!tokenVerifier.isTokenValid(token, response)) {
        return
    }

    let galleryID = request.query.galleryID
    let gallery = await photoDatabase.findGalleryByID(galleryID)
    if (gallery.photos.length > 0) {
        let thumbnail = PhotoConverter.convertPhotoNameToThumbnail(gallery.photos[0])
        response.sendFile(path.resolve(__dirname + "/../photos/thumbnails/" + thumbnail))
    } else {
        response.sendFile(path.resolve(__dirname + "/../photos/no-photo/no-photo.png"))
    }
})

router.get("/photo-gallery/get-all-tags-colors", async function (request, response) {
    let token = request.cookies.token
    if (!tokenVerifier.isTokenValid(token, response)) {
        return
    }
    let colors = fs.readFileSync(__dirname + "/../configs/colors.cfg")
    response.json(colors.toString())
})

router.get("/photos/fetch-photo-by-id", async function (request, response){
    let token = request.cookies.token
    if (!tokenVerifier.isTokenValid(token, response)) {
        return
    }
    const fileName = request.query.fileName
    const thumbnail = request.query.thumbnail
    if (thumbnail === "true"){
        response.sendFile(path.resolve(__dirname  + "/../photos/thumbnails/" + databaseHelpers.getThumbnailFromFileName(fileName)))
    }else{
        response.sendFile(path.resolve(__dirname + "/../photos/lite-photos/" + fileName))
    }
})



module.exports = {router}
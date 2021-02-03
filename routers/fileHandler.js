const express = require('express')
const router = express.Router()
const multer = require('multer');
const uploadPath = "./photos/uploads"
const path = require('path')
const fs = require('fs')
const photoDatabase = require("../databases/photoDatabase")
const PhotoConverter = require("./photoConverter")
const databaseHelpers = require("../databases/databaseHelpers")
const headerParser = require("./headersParser");
const { request } = require('http');
const { response } = require('express');

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

/*
takes care of uploading photos to server and saves them on disk and creates their thumbanils
*/
router.post("/eforce-gallery/gallery/photos/upload", async function (request, response) {
    let galleryId = request.cookies.galleryId
    const parsedHeaders = headerParser.getHeaders(request)
    upload(request, response, async function (error) {
        if (error) {
            response.status(400)
            response.json(JSON.stringify({
                status: "error"
            }))
        } else {
            PhotoConverter.handleNewPhoto(request.body.photoId, galleryId, parsedHeaders.username, true)
            response.status(202)
            response.json(JSON.stringify({
                status: "success"
            }))

        }
    })

})

/*
gets preview photo on gallery, if gallery is empty sends no photo image
*/
router.get("/eforce-gallery/photo-gallery/get-photo", async function (request, response) {

    let galleryID = request.query.galleryID
    let gallery = await photoDatabase.findGalleryByID(galleryID)
    if (gallery.photos.length > 0) {
        let thumbnail = PhotoConverter.convertPhotoNameToThumbnail(gallery.photos[0])
        response.sendFile(path.resolve(__dirname + "/../photos/thumbnails/" + thumbnail))
    } else {
        response.sendFile(path.resolve(__dirname + "/../photos/no-photo/no-photo.png"))
    }
})

/*
sends config with color for coloring tags on
*/
router.get("/eforce-gallery/photo-gallery/get-all-tags-colors", async function (request, response) {
    let colors = fs.readFileSync(__dirname + "/../configs/colors.cfg")
    response.json(colors.toString())
})

/*
fetches photo by id - filename for front end to show it
*/
router.get("/eforce-gallery/photos/fetch-photo-by-id", async function (request, response){
    const fileName = request.query.fileName
    const thumbnail = request.query.thumbnail
    if (thumbnail === "true"){
        response.sendFile(path.resolve(__dirname  + "/../photos/thumbnails/" + databaseHelpers.getThumbnailFromFileName(fileName)))
    }else{
        response.sendFile(path.resolve(__dirname + "/../photos/big-thumbnails/" + databaseHelpers.getThumbnailFromFileName(fileName)))
    }
})

/*
downloads one photo after sending request to download it with fetch
*/
router.get("/eforce-gallery/photos/download-one", async function(request, response){
    const data = request.query
    if (data.version === "full"){
        response.download(path.resolve(__dirname + "/../photos/uploads/" + data.filename), databaseHelpers.addStringToFileName(data.filename, "-full"))
    }else{
        response.download(path.resolve(__dirname + "/../photos/lite-photos/" + data.filename), databaseHelpers.addStringToFileName(data.filename, "-lite"))
    }
})

/*
uploads photo to existing gallery by its id
*/
router.post("/eforce-gallery/gallery-manager/photos/upload", async (request, response) =>{
    const parsedHeaders = headerParser.getHeaders(request)
    upload(request, response, async (error) =>{
        if(error){
            response.json({"message" : "Something went wrong"})
        }else{
            PhotoConverter.handleNewPhoto(request.body.photoId, request.query.galleryID, parsedHeaders.username, false)
            response.json({
                "message" : "ok"
            })
        }
    })
})




module.exports = {router}
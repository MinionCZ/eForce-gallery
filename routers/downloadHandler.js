const express = require('express')
const router = express.Router()
const tokenVerifier = require("../verifiers/token")
const uploadPath = "./photos/uploads/"
const path = require('path')
const fs = require('fs')
const photoDatabase = require("../databases/photoDatabase")
const PhotoConverter = require("./photoConverter")
const AdmZip = require('adm-zip')
const archiver = require("archiver")
router.post("/photo-gallery/download-whole-gallery", async function(request, response){
    let token = request.cookies.token
    if (!tokenVerifier.isTokenValid(token, response)) {
        return
    }
    const galleryTitle = request.body.title
    const version = request.body.version
    console.log(request.body)
    tokenVerifier.refreshToken(token, response)

    if (version === "full"){
        response.setHeader('Content-Disposition','attachment; filename=' + galleryTitle + ".zip");
        const photos = await photoDatabase.getAllGalleryPhotos(galleryTitle)
        createZipFromArray(galleryTitle ,photos, version, response)
    }
})
async function createZipFromArray(galleryTitle, array, version, response){
    const archive = archiver("zip", {store: true})
    const filePath = __dirname + "/../photos/zips/" + galleryTitle + "-" + version + ".zip"
    
    for (const photo of array){
        const file = uploadPath + photo
        archive.append(fs.createReadStream(file), {name: photo})
    }
    archive.pipe(response)
    archive.on("end", function(){
        response.end()
    })
    archive.finalize()
    return filePath
}


module.exports = router
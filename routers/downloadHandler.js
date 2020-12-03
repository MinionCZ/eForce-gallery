const express = require('express')
const router = express.Router()
const tokenVerifier = require("../verifiers/token")
const uploadPath = "./photos/uploads/"
const liteUploadPath = "./photos/lite-photos/"
const fs = require('fs')
const photoDatabase = require("../databases/photoDatabase")
const AdmZip = require('adm-zip')
const archiver = require("archiver")
router.post("/photo-gallery/download-whole-gallery", async function(request, response){
    let token = request.cookies.token
    if (!tokenVerifier.isTokenValid(token, response)) {
        return
    }
    const galleryID = request.body.galleryID
    const version = request.body.version
    tokenVerifier.refreshToken(token, response)
    const gallery = await photoDatabase.findGalleryByID(galleryID)

    response.setHeader('Content-Disposition','attachment; filename=' + gallery.galleryTitle + "-" + version + ".zip");
    createZipFromArray(gallery.photos, version, response)
    
})
async function createZipFromArray(array, version, response){
    const archive = archiver("zip", {store: true})
    archive.pipe(response)
    for (const photo of array){
        let file = version === "full" ? uploadPath : liteUploadPath
        file += photo
        archive.append(fs.createReadStream(file), {name: photo})
    }
    archive.finalize()
    archive.on("end", () =>{
        response.end()
    })
}


module.exports = router
const express = require('express')
const router = express.Router()
const tokenVerifier = require("../verifiers/token")
const photoDatabase = require("../databases/photoDatabase")


function harvestTags(request) {

    let tags = JSON.parse(request.body.tagsValue)
    let tagArray = []
    for (const tag of tags) {
        tagArray.push(tag.tagValue)
    }
    return tagArray
}

router.get("/gallery/add", async function (request, response) {
    let token = request.cookies.token
    if (!await tokenVerifier.isTokenValid(token, response)) {
        return
    }
    token = tokenVerifier.refreshToken(token, response)
    response.render("newGallery.ejs")
})
router.post("/gallery/add", async function (request, response) {
    let token = request.cookies.token
    const tempGalleryId = request.cookies.galleryId
    if (!await tokenVerifier.isTokenValid(token, response)) {
        return
    }
    token = tokenVerifier.refreshToken(token, response)
    if (parseInt(request.body.photoCounter) > 0) {
        photoDatabase.pushGalleryWithPhotos(tempGalleryId, request.body.title, request.body.label, harvestTags(request), request.body.date, tokenVerifier.getUsernameFromToken(token))
    } else {
        photoDatabase.pushGalleryWithoutPhotos(request.body.title, request.body.label, harvestTags(request), request.body.date, tokenVerifier.getUsernameFromToken(token))
    }
    response.render("newGallery.ejs")
})

router.get("/galleries/fetch-titles-and-tags", async function(request, response){
    let token = request.cookies.token
    if (!await tokenVerifier.isTokenValid(token, response)) {
        return
    }
    token = tokenVerifier.refreshToken(token, response)
    const galleries = await photoDatabase.getAllGalleries()
    const titles = []
    const tags = new Set()
    for (let gallery of galleries){
        titles.push(gallery.title)
        for (const tag of gallery.tags){
            tags.add(tag)
        }
    }
    const data = {titles:titles,
    tags:Array.from(tags)}
    response.json(data)
})




module.exports = router
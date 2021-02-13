const express = require('express')
const router = express.Router()
const photoDatabase = require("../databases/photoDatabase")
const headerParser = require("./headersParser")
const databaseHelper = require("../databases/databaseHelpers")

function harvestTags(request) {
    let tags = JSON.parse(request.body.tagsValue)
    let tagArray = []
    const tagSet = new Set()
    for (const tag of tags) {
        tag.tagValue = databaseHelper.cropSpaces(tag.tagValue)
        if (tag.tagValue !== "" && !tagSet.has(tag.tagValue)) {
            tagArray.push(tag.tagValue)
            tagSet.add(tag.tagValue)
        }
    }
    return tagArray
}

router.get("/eforce-gallery/gallery/add", async function (request, response) {
    response.render("newGallery.ejs")
})
router.post("/eforce-gallery/gallery/add", async function (request, response) {
    const tempGalleryId = request.cookies.galleryId
    const parsedHeaders = headerParser.getHeaders(request)
    const title = databaseHelper.cropSpaces(request.body.title)
    if (parseInt(request.body.photoCounter) > 0) {
        photoDatabase.pushGalleryWithPhotos(tempGalleryId, title, request.body.label, harvestTags(request), request.body.date, parsedHeaders.username)
    } else {
        photoDatabase.pushGalleryWithoutPhotos(title, request.body.label, harvestTags(request), request.body.date, parsedHeaders.username)
    }
    response.redirect("/eforce-gallery/gallery-manager?gallery-title=" +databaseHelper.stringToSearchParam(title))
})

router.get("/eforce-gallery/galleries/fetch-titles-and-tags", async function (request, response) {
    const galleries = await photoDatabase.getAllGalleries()
    const titles = []
    const tags = new Set()
    for (let gallery of galleries) {
        titles.push(gallery.title)
        for (const tag of gallery.tags) {
            tags.add(tag)
        }
    }
    const data = {
        titles: titles,
        tags: Array.from(tags)
    }
    response.json(data)
})



module.exports = router
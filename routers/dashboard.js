const express = require('express')
const router = express.Router()
const headerParser = require("./headersParser")
const photoDatabase = require("../databases/photoDatabase")
router.get("/eforce-gallery/dashboard", async function (request, response) {
    headerParser.getHeaders(request)
    response.render("dashboard.ejs", {
        galleries: JSON.stringify(await photoDatabase.getAllGalleries())
    });
})

router.get("/eforce-gallery/galleries/get-all", async function (request, response) {
    const allGalleries = await photoDatabase.getAllGalleries()
    response.json(allGalleries)

})
module.exports = router
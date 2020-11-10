const express = require('express')
const router = express.Router()

router.get("/unauthorized", async function (request, response) {
    response.clearCookie("token")
    response.clearCookie("galleryId")
    response.render("unauthorized.ejs")
})
module.exports = router
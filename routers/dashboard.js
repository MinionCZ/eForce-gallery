const express = require('express')
const router = express.Router()
const tokenVerifier = require("../verifiers/token")
const data = require("../databases/userDatabase")
const photoDatabase = require("../databases/photoDatabase")
router.get("/dashboard", async function (request, response) {
    let token = request.cookies.token
    if (!await tokenVerifier.isTokenValid(token, response)) {
        return
    }

    token = tokenVerifier.refreshToken(token, response)
    response.render("dashboard.ejs", {
        name: tokenVerifier.getUsernameFromToken(token),
        galleries: JSON.stringify(await photoDatabase.getAllGalleries())
    });
})

router.get("/galleries/get-all", async function (request, response) {
    let token = request.cookies.token
    if (!await tokenVerifier.isTokenValid(token, response)) {
        return
    }
    token = tokenVerifier.refreshToken(token, response)
    const allGalleries = await photoDatabase.getAllGalleries()
    response.json(allGalleries)

})


module.exports = router
const express = require('express')
const router = express.Router()
const tokenVerifier = require("../verifiers/token")
const data = require("../databases/userDatabase")
router.get("/dashboard", async function (request, response) {
    let token = request.cookies.token
    if (!await tokenVerifier.isTokenValid(token, response)) {
        return
    }
    token = tokenVerifier.refreshToken(token, response)
    response.render("dashboard.ejs", {
        name: tokenVerifier.getUsernameFromToken(token)
    });
})
module.exports = router
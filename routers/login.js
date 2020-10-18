const cookieParser = require('cookie-parser');
const express = require('express')
const router = express.Router()
const data = require("../databases/userDatabase");
const tokenVerifier = require("../verifiers/token")
router.get("/login", function (request, response) {
    let token = request.cookies.token
    if (token === undefined) {
        response.render("login.ejs");
    } else {
        tokenVerifier.isTokenValid(token, response, true)
    }
})


router.post("/login", async function (request, response) {
    let token = request.cookies.token
    if (token === undefined) {
        token = await tokenVerifier.generateNewAccessToken(request.body.username)
        response.cookie("token", token)
        response.redirect("/dashboard")
    } else {
        tokenVerifier.isTokenValid(token, response, true)
    }

})

module.exports = router
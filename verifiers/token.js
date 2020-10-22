const jwt = require("jsonwebtoken")
const fs = require("fs")
let tokenSecret = ""
const fsPromises = fs.promises
const tokenDatabase = require("../databases/tokenDatabase")
const sessions = new Map()
async function initJWT() {
    try {
        tokenSecret = await fsPromises.readFile(__dirname + "/../configs/JWTsecret.cfg")
        tokenSecret = tokenSecret.toString()
    } catch (error) {
        console.log(error)
    }
}

async function generateNewAccessToken(username) {
    let token = jwt.sign({
        username: username
    }, tokenSecret, {
        algorithm: 'HS256',
        expiresIn: "15m"
    })
    sessions.set(token, username)
    return token
}
async function isTokenValid(token, response, isLogin = false) {
    let valid = true
    valid = jwt.verify(token, tokenSecret, function (err, decoded) {
        if (err) {
            return false
        }
        return true
    })

    if (valid) {
        valid = sessions.has(token)
    }
    if (!valid) {
        handleBadToken(response)
    }
    if (isLogin && valid) {
        response.redirect("/dashboard")
    }
    return valid
}

function getUsernameFromToken(token) {
    let user = null
    if (sessions.has(token)) {
        user = sessions.get(token)
    }
    return user
}

function handleBadToken(response, redirection) {
    response.clearCookie("token")
    response.redirect("/unauthorized")
}

function refreshToken(token, response) {
    username = sessions.get(token)
    sessions.delete(token)
    let newToken = jwt.sign({
        username: username
    }, tokenSecret, {
        algorithm: 'HS256',
        expiresIn: "15m"
    })
    console.log(newToken)
    sessions.set(newToken, username)
    response.cookie("token", newToken)
    return newToken
}




module.exports = {
    initJWT,
    generateNewAccessToken,
    isTokenValid,
    getUsernameFromToken,
    refreshToken
}
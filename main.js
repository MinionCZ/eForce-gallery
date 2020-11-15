const express = require('express');
const app = express();
const port = 5000;
var bodyParser = require('body-parser')
const cookieParser = require('cookie-parser');
const loginRouter = require('./routers/login.js')
const mongoInitializer = require("./databases/mongoInitializer.js")
const dashboardRouter = require("./routers/dashboard")
const crypto = require("crypto")
const tokenVerifier = require("./verifiers/token")
const newGalleryRouter = require("./routers/newGallery")
const photosRouter = require("./routers/photos")
const fileUpload = require('express-fileupload');
const fileRouter = require("./routers/fileHandler")
const errorRouter = require("./routers/unauthorized")
const photoDatabase = require("./databases/photoDatabase")
var bodyParser = require('body-parser')


app.use(express.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
app.use(express.static("public"))
app.use(cookieParser())
app.use(loginRouter)
app.use(newGalleryRouter)
app.use(dashboardRouter)
app.use(photosRouter)
app.use(errorRouter)
app.use(fileRouter)
app.use(fileUpload({
    createParentPath: true
}))
app.set('view-engine', 'ejs')
const server = app.listen(port, function () {
    var host = server.address().address
    var port = server.address().port
    mongoInitializer.initMongo()
    tokenVerifier.initJWT();
    photoDatabase.clearTempGallery()
})
app.get("/", function (request, response) {
    response.redirect("/login")
})
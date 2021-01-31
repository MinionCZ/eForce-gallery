const express = require('express');
const app = express();
const port = 10088;
var bodyParser = require('body-parser')
const cookieParser = require('cookie-parser');
const mongoInitializer = require("./databases/mongoInitializer.js")
const dashboardRouter = require("./routers/dashboard")
const tokenVerifier = require("./verifiers/token")
const newGalleryRouter = require("./routers/newGallery")
const photosRouter = require("./routers/photos")
const fileUpload = require('express-fileupload');
const fileRouter = require("./routers/fileHandler")
const photoDatabase = require("./databases/photoDatabase")
const downloadHandler = require("./routers/downloadHandler")
const galleryManager = require("./routers/galleryManager")
var bodyParser = require('body-parser')


app.use(express.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
app.use("/eforce-gallery",express.static("public"))
app.use(cookieParser())
app.use(newGalleryRouter)
app.use(galleryManager.router)
app.use(dashboardRouter)
app.use(photosRouter)
app.use(fileRouter.router)
app.use(downloadHandler)
app.use(fileUpload({
    createParentPath: true
}))
app.use(redirectUnmatched)
app.set('view-engine', 'ejs')
const server = app.listen(port, function () {
    mongoInitializer.initMongo()
    tokenVerifier.initJWT();
    photoDatabase.clearTempGallery()
})
app.get("/", function (request, response) {
    response.redirect("/eforce-gallery/dashboard")
})
function redirectUnmatched(request, response){
    response.redirect("/eforce-gallery/dashboard")
}

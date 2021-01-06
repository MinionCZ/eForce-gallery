"use strict";

var express = require('express');

var app = express();
var port = 10088;

var bodyParser = require('body-parser');

var cookieParser = require('cookie-parser');

var loginRouter = require('./routers/login.js');

var mongoInitializer = require("./databases/mongoInitializer.js");

var dashboardRouter = require("./routers/dashboard");

var tokenVerifier = require("./verifiers/token");

var newGalleryRouter = require("./routers/newGallery");

var photosRouter = require("./routers/photos");

var fileUpload = require('express-fileupload');

var fileRouter = require("./routers/fileHandler");

var errorRouter = require("./routers/unauthorized");

var photoDatabase = require("./databases/photoDatabase");

var downloadHandler = require("./routers/downloadHandler");

var galleryManager = require("./routers/galleryManager");

var bodyParser = require('body-parser');

app.use(express.urlencoded({
  extended: true
}));
app.use(bodyParser.json());
app.use("/eforce-gallery", express["static"]("public"));
app.use(cookieParser());
app.use(loginRouter);
app.use(newGalleryRouter);
app.use(galleryManager.router);
app.use(dashboardRouter);
app.use(photosRouter);
app.use(errorRouter);
app.use(fileRouter.router);
app.use(downloadHandler);
app.use(fileUpload({
  createParentPath: true
}));
app.use(redirectUnmatched);
app.set('view-engine', 'ejs');
var server = app.listen(port, function () {
  var host = server.address().address;
  var port = server.address().port;
  mongoInitializer.initMongo();
  tokenVerifier.initJWT();
  photoDatabase.clearTempGallery();
});
app.get("/", function (request, response) {
  response.redirect("/login");
});

function redirectUnmatched(request, response) {
  response.redirect("/eforce-gallery/login");
}
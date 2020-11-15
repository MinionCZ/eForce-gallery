"use strict";

var express = require('express');

var app = express();
var port = 5000;

var bodyParser = require('body-parser');

var cookieParser = require('cookie-parser');

var loginRouter = require('./routers/login.js');

var mongoInitializer = require("./databases/mongoInitializer.js");

var dashboardRouter = require("./routers/dashboard");

var crypto = require("crypto");

var tokenVerifier = require("./verifiers/token");

var newGalleryRouter = require("./routers/newGallery");

var photosRouter = require("./routers/photos");

var fileUpload = require('express-fileupload');

var fileRouter = require("./routers/fileHandler");

var errorRouter = require("./routers/unauthorized");

var photoDatabase = require("./databases/photoDatabase");

var bodyParser = require('body-parser');

app.use(express.urlencoded({
  extended: true
}));
app.use(bodyParser.json());
app.use(express["static"]("public"));
app.use(cookieParser());
app.use(loginRouter);
app.use(newGalleryRouter);
app.use(dashboardRouter);
app.use(photosRouter);
app.use(errorRouter);
app.use(fileRouter);
app.use(fileUpload({
  createParentPath: true
}));
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
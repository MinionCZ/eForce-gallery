"use strict";

function getHeaders(request) {
  var username = request.header("X-Auth-Username");
  var userID = request.header("X-Auth-Userid");
  var userEmail = request.header("X-Auth-Email");

  if (username === undefined) {
    username = "Randolf";
  }

  if (userID === undefined) {
    userID = "RandolfID";
  }

  if (userEmail === undefined) {
    userEmail = "Randolf's email";
  }

  return {
    username: username,
    userID: userID,
    userEmail: userEmail
  };
}

module.exports = {
  getHeaders: getHeaders
};
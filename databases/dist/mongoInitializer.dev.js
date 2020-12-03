"use strict";

var _require = require("mongodb"),
    MongoClient = _require.MongoClient;

var client = null;

var fs = require('fs');

var tokenDatabase = require("./tokenDatabase");

var photoDatabase = require("./photoDatabase");

function initMongo() {
  var mongoUrl;
  return regeneratorRuntime.async(function initMongo$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          mongoUrl = fs.readFileSync(__dirname + "/../configs/mongoConfig.cfg").toString();
          client = new MongoClient(mongoUrl, {
            useNewUrlParser: true,
            useUnifiedTopology: true
          });
          _context.prev = 2;
          _context.next = 5;
          return regeneratorRuntime.awrap(client.connect());

        case 5:
          console.log(client.isConnected());
          tokenDatabase.clientInitializer(client);
          photoDatabase.clientInitializer(client);
          photoDatabase.galleryModifierInit(client);
          _context.next = 14;
          break;

        case 11:
          _context.prev = 11;
          _context.t0 = _context["catch"](2);
          console.log(_context.t0);

        case 14:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[2, 11]]);
}

function verifyDatabaseConnection() {
  return regeneratorRuntime.async(function verifyDatabaseConnection$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          if (client.isConnected()) {
            _context2.next = 3;
            break;
          }

          _context2.next = 3;
          return regeneratorRuntime.awrap(client.connect());

        case 3:
        case "end":
          return _context2.stop();
      }
    }
  });
}

function getClient() {
  return client;
}

module.exports = {
  initMongo: initMongo,
  verifyDatabaseConnection: verifyDatabaseConnection,
  getClient: getClient
};
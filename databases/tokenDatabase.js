const mongoClient = require("mongodb")
let client = null
let collection = null

function clientInitializer(clientInit) {
    client = clientInit
    collection = client.db("eForceGallery").collection("tokens")
}

function checkConnection() {
    if (!client.isConnected()) {
        client.connect()
    }
    return true
}
async function pushNewToken(username, token) {
    let object = {
        username: username,
        token: token
    }
    date = new Date();
    collection.insertOne(object)
}

module.exports = {
    pushNewToken,
    clientInitializer
}
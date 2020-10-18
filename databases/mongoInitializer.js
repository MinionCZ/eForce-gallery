const {
    MongoClient
} = require("mongodb")
let client = null
const fs = require('fs')
const tokenDatabase = require("./tokenDatabase")

async function initMongo() {
    let mongoUrl = fs.readFileSync(__dirname + "/../configs/mongoConfig.cfg").toString()
    client = new MongoClient(mongoUrl, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    try {
        await client.connect()
        console.log(client.isConnected())
        tokenDatabase.clientInitializer(client)
    } catch (err) {
        console.log(err)
    }
}
async function verifyDatabaseConnection() {
    if (!client.isConnected()) {
        await client.connect()
    }
}

function getClient() {
    return client
}

module.exports = {
    initMongo,
    verifyDatabaseConnection,
    getClient
}
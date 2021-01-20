function getHeaders(request){
    let username = request.header("X-Auth-Username")
    let userID = request.header("X-Auth-Userid")
    let userEmail = request.header("X-Auth-Email")
    if (username === undefined){
        username = "Randolf"
    }
    if (userID === undefined){
        userID = "RandolfID"
    }
    if (userEmail === undefined){
        userEmail = "Randolf's email"
    }
    return {
        username: username,
        userID: userID,
        userEmail: userEmail
    }
}
module.exports = {
    getHeaders
}
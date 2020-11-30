function changeMapping(mapping) {
    switch (mapping) {
        case "dashboard":
            window.location = "/dashboard"
            break
        case "newGallery":
            window.location = "/gallery/add"
            break
        case "galleries":
            window.location = "/galleries"
            break
        case "photos":
            window.location = "/photos"
            break
        default:
            window.location = "/dashboard"
            break
    }
}

function appendUrlParam(url, paramName, param){
    if (isFirstParam(url)){
        url += "?" + paramName + "=" + param
    }else{
        url += "&" + paramName + "=" + param
    }
    return url

}

function isFirstParam(url){
    for (let i = url.length -1; i>=0; i--){
        if (url[i] === "?" ){
            return false
        }
    }
    return true
}
export{
    appendUrlParam
    }
/*
changes current mapping + sets cookie which button is pressed now
*/
function changeMapping(mapping) {
    document.cookie = "mapping=" + mapping + "; path=/;"
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
    }
}

/*
calls function after window is loaded
*/

window.addEventListener("load", setClickedButton)


/*
sets clicked button after page is loaded
*/
function setClickedButton(){
    let value = parseCookie("mapping")
    console.log(document.cookie.split(";"))
    let div = document.getElementById("buttonDiv").children
    for(var button of div){
        if(button.value === value){
            button.setAttribute("class", "navButton-selected")
        }
    }

}
/*
parses cookies from browser by name
*/
function parseCookie(name){
    let cookies = document.cookie.split(";")
    const map = new Map()
    for(const cookie of cookies){
        let oreo = cookie.split("=")
        map.set(parseName(oreo[0]), oreo[1])
    }
    let returnValue = null
    if(map.has(name)){
        returnValue = map.get(name)
    }
    return returnValue
}

/*
some cookie names has space before name, this function crop the space, or return name if it is without space
*/

function parseName(name){
    let nameToReturn = ""
    if (name[0] === " "){
        nameToReturn = name.substring(1)
    }else{
        nameToReturn = name
    }
    return nameToReturn

}
import{
    generateMainPageButtons
}from "./mainPageButtons.js"
import{
    generatePhotoSideBar, updateActualPageInput
}from "./photoPageButtons.js"

let isOpen = false
const sideBar = document.createElement("div")
sideBar.setAttribute("class", "side-bar hidden")
function generateSideToggleButton(callback = null){
    const sideButton = document.createElement("button")
    sideButton.setAttribute("class", "side-button")
    sideButton.setAttribute("id", "sideButton")
    sideButton.innerHTML = "*" + "</br>" + "*" + "</br>" + "*"
    if(!document.body.contains(document.getElementById("sideButton"))){
        document.body.appendChild(sideButton)
    }
    sideButton.onclick = () =>{
       toggleBar(callback)
    }
}
function generateSideLayout(infoPage, callback = null){
    sideBar.innerHTML = ""
    sideBar.appendChild(getExitSideBarButton(callback))
    sideBar.appendChild(gerateTopTitle("Actions:"))
    if(infoPage){
        sideBar.appendChild(generateMainPageButtons())
        document.body.appendChild(sideBar)
    }else{
        sideBar.appendChild(generatePhotoSideBar())
        document.body.appendChild(sideBar)
        updateActualPageInput()
    }
    
}

function getExitSideBarButton(callback){
    const button = document.createElement("button")
    button.setAttribute("class", "exit-side-bar-button")
    button.innerText = "\u2715"
    button.onclick = () =>{
        toggleBar(callback)
    }
    return button
}

function toggleBar(callback){
    if(!isOpen){
        sideBar.setAttribute("class", "side-bar visible")
    }else{
        sideBar.setAttribute("class", "side-bar hidden")
    }
    isOpen = !isOpen
    if(callback !== null){
        callback()
    }

}

function gerateTopTitle(sideBarTitle){
    const title = document.createElement("h2")
    title.setAttribute("class", "side-bar-title")
    title.innerText = sideBarTitle
    return title
}

function generateActionButton(text, callback){
    const button = document.createElement("button")
    button.innerHTML = text
    button.setAttribute("class", "side-bar-action-button")
    button.onclick = () =>{
        callback()
    }
    return button
}

function clearSideLayout(){
    if(document.body.contains(sideBar)){
        document.body.removeChild(sideBar)
    }
    if(document.body.contains(document.getElementById("sideButton"))){
        document.body.removeChild(document.getElementById("sideButton"))
    }
}
function isSideBarToggled(){
    return isOpen
}


export{
    generateSideToggleButton,
    generateSideLayout,
    generateActionButton,
    clearSideLayout,
    isSideBarToggled,
    toggleBar
}
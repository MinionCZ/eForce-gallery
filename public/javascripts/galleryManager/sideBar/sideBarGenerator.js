import{
    generateMainPageButtons
}from "./mainPageButtons.js"
import{
    generatePhotoSideBar, updateActualPageInput
}from "./photoPageButtons.js"

let isOpen = false
const sideBar = document.createElement("div")
sideBar.setAttribute("class", "side-bar hidden")
/*
generates button for toggle of side bar
*/
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
/*
generates side layout
*/
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
/*
generates exit button for side bar
*/

function getExitSideBarButton(callback){
    const button = document.createElement("button")
    button.setAttribute("class", "exit-side-bar-button")
    button.innerText = "\u2715"
    button.onclick = () =>{
        toggleBar(callback)
    }
    return button
}

/*
toggles side bar
*/
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
/*
generates top tittle
*/
function gerateTopTitle(sideBarTitle){
    const title = document.createElement("h2")
    title.setAttribute("class", "side-bar-title")
    title.innerText = sideBarTitle
    return title
}
/*
generates action button with callback after click
*/
function generateActionButton(text, callback, id = ""){
    const button = document.createElement("button")
    button.innerHTML = text
    button.setAttribute("class", "side-bar-action-button")
    button.setAttribute("id", id)
    button.onclick = () =>{
        callback()
    }
    return button
}
/*
clears side layout
*/

function clearSideLayout(){
    if(document.body.contains(sideBar)){
        document.body.removeChild(sideBar)
    }
    if(document.body.contains(document.getElementById("sideButton"))){
        document.body.removeChild(document.getElementById("sideButton"))
    }
}
/*
returns if is side bar toggled
*/
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
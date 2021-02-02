import{
    generateMainPageButtons
}from "./mainPageButtons.js"
let isOpen = false
const sideBar = document.createElement("div")
function generateSideToggleButton(){
    const sideButton = document.createElement("button")
    sideButton.setAttribute("class", "side-button")
    sideButton.setAttribute("id", "sideButton")
    sideButton.innerHTML = "*" + "</br>" + "*" + "</br>" + "*"
    if(!document.body.contains(document.getElementById("sideButton"))){
        document.body.appendChild(sideButton)
    }
    sideButton.onclick = () =>{
       toggleBar()
    }
}
function generateSideLayout(infoPage){
    sideBar.setAttribute("class", "side-bar hidden")
    sideBar.appendChild(getExitSideBarButton())
    sideBar.appendChild(gerateTopTitle("Actions:"))
    if(infoPage){
        sideBar.appendChild(generateMainPageButtons())
    }
    document.body.appendChild(sideBar)
}

function getExitSideBarButton(){
    const button = document.createElement("button")
    button.setAttribute("class", "exit-side-bar-button")
    button.innerText = "\u2715"
    button.onclick = () =>{
        toggleBar()
    }
    return button
}

function toggleBar(){
    if(!isOpen){
        sideBar.setAttribute("class", "side-bar visible")
    }else{
        sideBar.setAttribute("class", "side-bar hidden")
    }
    isOpen = !isOpen
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


export{
    generateSideToggleButton,
    generateSideLayout,
    generateActionButton
}
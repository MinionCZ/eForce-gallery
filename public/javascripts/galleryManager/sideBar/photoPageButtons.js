import{
    generateActionButton
}from "./sideBarGenerator.js"

function generatePhotoSideBar(){
    const holderDiv = document.createElement("div")
    holderDiv.setAttribute("class", "side-bar-action-div")
    //heere build layout with page
    holderDiv.appendChild(generateActionButton("Select all photos"), null)
    holderDiv.appendChild(generateActionButton("Select all photos on page"), null)
    holderDiv.appendChild(generateActionButton("Download selected photos"), null)
    holderDiv.appendChild(generateActionButton("Delete selected photos"), null)
    return holderDiv
}

function createPageHolder(){
    const div = document.createElement("div")
    div.setAttribute("class", "side-bar-page-div")
    
}



export{
    generatePhotoSideBar
}
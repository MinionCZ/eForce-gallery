import{
    generateActionButton
}from "./sideBarGenerator.js"

import{
    PhotoStore
}from "../photosShower/photoStore.js"
import { buildMainLayout } from "../mainPageGenerator.js"
function generatePhotoSideBar(){
    const holderDiv = document.createElement("div")
    holderDiv.setAttribute("class", "side-bar-action-div")
    holderDiv.appendChild(createPageDiv())
    holderDiv.appendChild(generateActionButton("Select all photos"), null)
    holderDiv.appendChild(generateActionButton("Select all photos on page"), null)
    holderDiv.appendChild(generateActionButton("Download selected photos"), null)
    holderDiv.appendChild(generateActionButton("Delete selected photos"), null)
    return holderDiv
}
function createPageDiv(){
    const div = document.createElement("div")
    const textPageInput = document.createElement("input")
    const maxPageLabel = document.createElement("label")

    div.setAttribute("class", "page-holder-div")
    textPageInput.setAttribute("class", "actual-page-input")
    textPageInput.setAttribute("id", "actualPageInput")
    textPageInput.setAttribute("type", "text")
    textPageInput.innerText = "" + PhotoStore.getActualPage()

    maxPageLabel.setAttribute("class", "max-page-label")
    maxPageLabel.innerText = "/" + PhotoStore.getMaxPage()
    div.appendChild(createChangePageButtons("decrement", false))
    div.appendChild(textPageInput)
    div.appendChild(maxPageLabel)
    div.appendChild(createChangePageButtons("increment", true))
    return div
}
function createChangePageButtons(cssClass, increment){
    const button = document.createElement("button")
    button.setAttribute("class", "change-page-button " + cssClass)
    if(increment){
        button.setAttribute("id", "incrementPageButton")
    }else{
        button.setAttribute("id", "decrementPageButton")
    }
    button.onclick = () =>{
        let actual = PhotoStore.getActualPage()
        if(increment){
            actual++
        }else{
            actual--
        }
        PhotoStore.setActualPage(actual)
        updateActualPageInput()
    }
    return button
}
function updateActualPageInput(){
    document.getElementById("actualPageInput").value = PhotoStore.getActualPage()
    document.getElementById("incrementPageButton").disabled = PhotoStore.getActualPage() === PhotoStore.getMaxPage()
    document.getElementById("decrementPageButton").disabled = PhotoStore.getActualPage() === 1
}



export{
    generatePhotoSideBar,
    updateActualPageInput
}
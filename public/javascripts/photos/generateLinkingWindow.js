import { fetchAllGalleries } from "../galleryManager/galleryFetcher.js"
import { CheckStore } from "./checkStore.js"
import { PhotosStore } from "./photosStore.js"
import { linkPhotosToDatabase } from "./requests.js"

async function createLinkingWindow(){
    const root = document.createElement("div")
    root.setAttribute("class", "root-linking-window")
    root.setAttribute("id", "rootLinkingWindow")
    const photosToLink = CheckStore.getSelectedPhotos()
    root.appendChild(await createLayout(photosToLink))
    root.onclick = (event) =>{
        if(event.target.id === "rootLinkingWindow"){
            exitLinkingWindow()
        }
    }


    document.body.appendChild(root)
}

async function createLayout(photosToLink) {
    const root = document.createElement("div")
    root.setAttribute("class", "linking-window")
    root.appendChild(createTitle(photosToLink))
    root.appendChild(await createGallerySelector())

    const buttonLine = document.createElement("div")
    buttonLine.setAttribute("class", "linking-window-button-line")
    buttonLine.appendChild(createActionButton("linking-window-action-button linking-confirm", "Confirm", executeLink))
    buttonLine.appendChild(createActionButton("linking-window-action-button linking-cancel", "Cancel", exitLinkingWindow))
    root.appendChild(buttonLine)
    return root
}

function createTitle(photosToLink) {
    const title = document.createElement("h2")
    if(photosToLink.photos.length > 1 || photosToLink.allSelected){
        title.innerText = "Select gallery in which will be this " + calculateSelectedPhotos(photosToLink) + " photos added"
    }else{
        title.innerText = "Select gallery in which will be this photo added"
    }
    return title
}
async function createGallerySelector() {
    const galTitles = await fetchAllGalleries()
    const selector = document.createElement("select")
    selector.setAttribute("class", "gallery-selector")
    selector.setAttribute("id", "gallerySelector")
    for(const title of galTitles){
        const option = document.createElement("option")
        option.text = title
        selector.add(option)
    }
    return selector
}
function exitLinkingWindow() {
    const root = document.getElementById("rootLinkingWindow")
    if(document.body.contains(root)){
        document.body.removeChild(root)
    }
}

function createActionButton(cssClass, text, callback){
    const button = document.createElement("button")
    button.setAttribute("class", cssClass)
    button.innerText = text
    button.onclick = () =>{
        callback()
    }
    return button
}
function calculateSelectedPhotos(selectedPhotos) {
    if(selectedPhotos.allSelected){
        return PhotosStore.getAllPhotosCount() - selectedPhotos.photos.length
    }else{
        return selectedPhotos.photos.length
    }
}

function executeLink() {
    const photosToLink = CheckStore.getSelectedPhotos()
    const galleryTitle = document.getElementById("gallerySelector").value
    linkPhotosToDatabase(photosToLink.photos, photosToLink.allSelected, galleryTitle)
    exitLinkingWindow()
}


export{
    createLinkingWindow
}


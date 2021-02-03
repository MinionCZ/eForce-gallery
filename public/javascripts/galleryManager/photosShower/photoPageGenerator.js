import{
    generateTopSwitchLayout
}from "../topSwitchLayout.js"

import{
    GalleryStore
}from "../galleryStore.js"
import{
    PhotoLayout
}from "./photoLayout.js"
import{
    generateSideLayout,
    generateSideToggleButton,
    isSideBarToggled,
    toggleBar
}from "../sideBar/sideBarGenerator.js"
import { PhotoStore } from "./photoStore.js"
const root = GalleryStore.getRoot()
function buildPhotosLayout(){
    PhotoStore.obtainAllPhotos()
    root.appendChild(generateTopSwitchLayout())
    generateSideToggleButton(buildLayout)
    generateSideLayout(false, buildLayout)
    if(!isSideBarToggled()){
        toggleBar(null)
    }
    root.appendChild(buildLayout())

}
function buildLayout(){
    console.log("called")
    let div = document.createElement("div")
    if(!document.body.contains(document.getElementById("galleryManagerPhotosLayout"))){
        div.setAttribute("class", "gallery-manager-photos-layout")
        div.setAttribute("id", "galleryManagerPhotosLayout")
    }else{
        div = document.getElementById("galleryManagerPhotosLayout")
        div.innerHTML = ""
    }


    const lines = buildPhotoLineDivs()
    for(const line of lines){
        div.appendChild(line)
    }
    return div

}


function buildPhotoLineDivs(){
    const photosForLine = isSideBarToggled() ? 5 : 6
    const photosToRender = PhotoStore.getPhotosForPage()
    console.log(photosToRender, PhotoStore.getMaxPage())
    const lines = []
    let counter = 0
    let actualDiv = document.createElement("div")
    for(const photo of photosToRender){
        if(counter === photosForLine){
            counter = 0
            if(lines.length === 0){
                actualDiv.setAttribute("class", "gallery-manager-photos-line first-line")
            }else{
                actualDiv.setAttribute("class", "gallery-manager-photos-line")
            }
            lines.push(actualDiv)
            actualDiv = document.createElement("div")
        }
        actualDiv.appendChild(new PhotoLayout(photo).generateLayout())
        counter++
    }
    if(counter !== 0){
        for(; counter < photosForLine; counter++){
            const blankDiv = document.createElement("div")
            blankDiv.setAttribute("class", "blank-div")
            actualDiv.appendChild(blankDiv)
        }
        actualDiv.setAttribute("class", "gallery-manager-photos-line")
        lines.push(actualDiv)
    }
    return lines

}



export{
    buildPhotosLayout
}
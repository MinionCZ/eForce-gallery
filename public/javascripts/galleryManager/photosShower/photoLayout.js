import {
    PhotoStore
}from "./photoStore.js"


class PhotoLayout{
    constructor(filename){
        this.filename = filename
    }
    generateLayout(){
        const div = document.createElement("div")
        div.setAttribute("class", "gallery-manager-thumbnail-div")
        div.appendChild(this.generatePhotoLayout())
        div.appendChild(this.generateCheckBox())
        return div
    }
    async generatePhotoLayout(){
        const image = document.createElement("img")
        image.src = "/eforce-gallery/photos/fetch-photo-by-id?fileName=" + this.filename + "&thumbnail=false"
        image.setAttribute("class", "gallery-manager-thumbnail")
        return image
    }

    generateCheckBox(){
        const checkBox = document.createElement("input")
        checkBox.setAttribute("type", "checkbox")
        checkBox.checked = PhotoStore.isPhotoTagged(this.filename)
        checkBox.setAttribute("class", "gallery-manager-checkbox")
        return checkBox
    }
}
export{
    PhotoLayout
}
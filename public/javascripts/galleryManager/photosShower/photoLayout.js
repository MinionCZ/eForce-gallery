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
        this.checkBox = this.generateCheckBox()
        div.appendChild(this.checkBox)
        return div
    }
    generatePhotoLayout(){
        const div = document.createElement("div")
        div.setAttribute("class", "vertical-div")
        const image = document.createElement("img")
        image.src = "/eforce-gallery/photos/fetch-photo-by-id?fileName=" + this.filename + "&thumbnail=true"
        image.setAttribute("class", "gallery-manager-thumbnail")
        image.height = 280
        image.width = 420
        div.appendChild(image)
        return image
    }

    generateCheckBox(){
        const checkBox = document.createElement("input")
        checkBox.setAttribute("type", "checkbox")
        checkBox.checked = PhotoStore.isPhotoTagged(this.filename)
        checkBox.onclick =() =>{
            PhotoStore.toggleTagOnPhoto(this.filename)
        }
        checkBox.setAttribute("class", "photo-checkbox")
        return checkBox
    }
    updateCheckBox(){
        this.checkBox.checked = PhotoStore.isPhotoTagged(this.filename)
    }
}
export{
    PhotoLayout
}
import {CheckStore} from "./checkStore.js"
import {PhotosStore} from "./photosStore.js"
class Photo{
    constructor(jsonObject){
        this.fileName = jsonObject.fileName
        this.width = jsonObject.width
        this.height = jsonObject.height
        this.tags = jsonObject.tags
        this.galleries = jsonObject.galleryTitles
        this.contributionDate = jsonObject.dateOfContribution
        this.checkBox = null
        this.fullSize = jsonObject.fullSizeInMB
        this.liteSize = jsonObject.liteSizeInMB
    }



    getDivForRender(){
        const root = document.createElement("div")
        root.setAttribute("id", "photoDiv")
        root.setAttribute("class", "photo-div")
        const picture = document.createElement("img")
        picture.setAttribute("src", this.getImageLink(true))
        picture.setAttribute("class", "thumbnail")
        picture.setAttribute("width", "420px")
        picture.setAttribute("height", "280px")
        const checkBox = document.createElement("input")
        checkBox.setAttribute("type", "checkbox")
        checkBox.setAttribute("class", "photo-checkbox")
        checkBox.setAttribute("value", this.fileName)
        checkBox.checked = CheckStore.isPhotoChecked(this.fileName)
        checkBox.addEventListener("change", this.changeClickState)
        root.appendChild(picture)
        root.appendChild(checkBox)
        this.checkBox = checkBox
        return root
    }
    getImageLink(thumbnail = false){
        return "/eforce-gallery/photos/fetch-photo-by-id?fileName=" + this.fileName + "&thumbnail=" + thumbnail
    }
    changeClickState(){
        if(this.checked){
            CheckStore.addCheckedPhoto(this.value)
        }else{
            CheckStore.removeCheckedPhoto(this.value)
        }
    }
    getCroppedSize(version){
        let size = 0
        if(version === "full"){
            size = this.fullSize
        }else{
            size = this.liteSize
        }
        size *= 100
        size = Math.floor(size)/100
        return size
    }
}
export{
    Photo
}
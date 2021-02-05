import {
    generateRootElement,
    generateSideButtons,
    generateTopLine,
    generatePhotoView,
    setPhotoToPreview,
    generateCheckBox
} from "./photoPreviewGenerator.js"

import{
    createPopupWindow
} from "../photos/layoutGenerator.js"
class PhotoPreview {
    constructor(photo, lastCallback, nextCallback, indexOnPage, refreshCallback, isPreviousPhoto, isNextPhoto, isGalleryManager = false) {
        this.indexOnPage = indexOnPage
        this.photo = photo
        this.isGalleryManager = isGalleryManager
        this.rootElement = generateRootElement()
        this.sideButtons = generateSideButtons(lastCallback, nextCallback)
        this.rootElement.appendChild(this.sideButtons.leftButton)
        this.rootElement.appendChild(this.sideButtons.rightButton)
        this.rootElement.appendChild(generateTopLine(photo.fileName, this.downloadPhoto, this.deletePhoto, this.rootElement, refreshCallback))
        this.rootElement.appendChild(generateCheckBox(photo, isGalleryManager))
        this.rootElement.appendChild(generatePhotoView(photo.getImageLink(false)))
        document.body.appendChild(this.rootElement)
        this.setButtonsState(isPreviousPhoto, isNextPhoto)
    }
    /*
    downloads current photo
    */
    async downloadPhoto(filename, version) {
        const a = document.createElement("a")
        a.href = window.location.origin + "/eforce-gallery/photos/download-one?version=" + version + "&" + "filename=" + filename
        a.click()
    }

    /*
    deletes photo which is currently selected, sends it to the back end and refresh page
    */
    async deletePhoto(filename, refreshCallback) {
        const data = {
            photos: [filename],
            allPhotos: false
        }
        const response = await fetch("/eforce-gallery/photos/delete", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        refreshCallback()
        createPopupWindow((await response.json()).deleted)
    }
    /*
    returns index
    */
    getIndex() {
        return this.indexOnPage
    }

    /*
    sets photo to preview
    */
    setPhotoToPreview(photo, isPreviousPhoto, isNextPhoto){
        this.photo = photo
        setPhotoToPreview(photo, this.isGalleryManager)
        document.getElementById("leftSideButton").disabled = !isPreviousPhoto
        document.getElementById("rightSideButton").disabled = !isNextPhoto
    }
    /*
    sets index
    */
    setIndex(index){
        this.indexOnPage = index
    }
    /*
    deletes preview
    */
    deletePreview(){
        if(document.body.contains(this.root)){
            document.body.removeChild(this.root)
        }
    }
    /*
    sets if buttons are clickable from the begging
    */
    setButtonsState(isPreviousPhoto, isNextPhoto){
        document.getElementById("leftSideButton").disabled = !isPreviousPhoto
        document.getElementById("rightSideButton").disabled = !isNextPhoto
    }
}
export {
    PhotoPreview
}
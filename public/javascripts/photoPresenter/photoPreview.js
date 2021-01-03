import {
    generateRootElement,
    generateSideButtons,
    generateTopLine,
    generatePhotoView,
    setPhotoToPreview,
    generateCheckBox
} from "./photoPreviewGenerator.js"
class PhotoPreview {
    constructor(photo, lastCallback, nextCallback, indexOnPage) {
        this.indexOnPage = indexOnPage
        this.photo = photo
        this.rootElement = generateRootElement()
        this.sideButtons = generateSideButtons(lastCallback, nextCallback)
        this.rootElement.appendChild(this.sideButtons.leftButton)
        this.rootElement.appendChild(this.sideButtons.rightButton)
        this.rootElement.appendChild(generateTopLine(photo.fileName, this.downloadPhoto, this.deletePhoto, this.rootElement))
        this.rootElement.appendChild(generateCheckBox(photo))
        this.rootElement.appendChild(generatePhotoView(photo.getImageLink(false)))
        document.body.appendChild(this.rootElement)
    }
    /*
    downloads current photo
    */
    async downloadPhoto(filename, version) {
        const a = document.createElement("a")
        a.href = window.location.origin + "/photos/download-one?version=" + version + "&" + "filename=" + filename
        a.click()
    }

    /*
    deletes photo which is currently selected
    */
    deletePhoto(filename) {
        console.log(this.indexOnPage)
    }
    /*
    returns index
    */
    getIndex() {
        return this.indexOnPage
    }
    /*
    increments index of photo on page
    */
    incrementIndex(increment) {
        if (increment) {
            this.indexOnPage++
        } else {
            this.indexOnPage--
        }
    }
    setPhotoToPreview(photo){
        this.photo = photo
        setPhotoToPreview(photo)
    }
}
export {
    PhotoPreview
}
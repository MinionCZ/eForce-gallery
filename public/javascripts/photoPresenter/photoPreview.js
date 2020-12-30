import {
    generateRootElement,
    generateSideButtons,
    generateTopLine
} from "./photoPreviewGenerator.js"
class PhotoPreview {
    constructor(filename, lastCallback, nextCallback, indexOnPage) {
        this.indexOnPage = indexOnPage
        this.filename = filename
        this.rootElement = generateRootElement()
        this.sideButtons = generateSideButtons(lastCallback, nextCallback)
        this.rootElement.appendChild(this.sideButtons.leftButton)
        this.rootElement.appendChild(this.sideButtons.rightButton)
        this.rootElement.appendChild(generateTopLine(filename, this.downloadPhoto, this.deletePhoto, this.rootElement))
        document.body.appendChild(this.rootElement)
    }
    async downloadPhoto(version) {
        console.log(this.filename, version)
    }

    async deletePhoto() {
        console.log(this.filename)
    }
    getIndex(){
        return this.indexOnPage
    }
    incrementIndex(increment){
        if (increment){
            this.indexOnPage++
        }else{
            this.indexOnPage--
        }
    }
}
export{
    PhotoPreview
}
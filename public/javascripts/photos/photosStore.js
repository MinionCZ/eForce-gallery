import {
    Photo
} from "./photo.js"
import{setMaxPage} from "./topSelectorHandler.js"
class PhotosStore {
    static photos = []
    static photosCount = 0
    static divs = []
    static leftToggled = false
    static rightToggled = false
    static photosPerLine = 0
    static fetchPage(page) {
        let request = new XMLHttpRequest()
        request.open("GET", "/get-all-photos?page=" + page + "&photosPerPage=" + 60)
        request.onload = () => {
            this.fillPhotosArray(request.responseText)
        }
        request.send();
    }
    /*
    fills array with photos from backend
    */


    static fillPhotosArray(json) {
        this.photos = []
        const parsedJson = JSON.parse(json)
        this.photosCount = parsedJson.photosCount
        setMaxPage(this.photosCount)
        for (const photo of parsedJson.photos) {
            this.photos.push(new Photo(photo))
        }
        this.renderPhotos()
    }
    /*
    sets state of sidebar, true if it is open, false if it is closed
    */
    static setToggleState(state, barValue) {
        if (barValue === "tags") {
            this.rightToggled = state
        } else {
            this.leftToggled = state
        }
    }
    /*
    get state of sidebar
    */
    static getToggleState(barValue) {
        if (barValue === "tags") {
            return this.rightToggled
        }
        return this.leftToggled
    }

    /*
    renders photos from photo array
    */
    static renderPhotos() {
        this.destroyLineDivs()
        this.createPhotoDivs()
        for (let i = 0; i < this.photos.length; i++) {
            this.divs[Math.floor(i / this.photosPerLine)].appendChild(this.photos[i].getDivForRender())
        }
        const lastDiv = this.divs[this.divs.length - 1]
        console.log(lastDiv)
        if (lastDiv.children.length !== this.photosPerLine) {
            for (let i = lastDiv.childNodes.length; i < this.photosPerLine; i++) {
                lastDiv.appendChild(this.createBlankPhotoDiv())
            }
        }
        for (const div of this.divs) {
            document.body.appendChild(div)
        }
    }

    /*
    creates line divs for layout
    */
    static createPhotoDivs() {
        this.photosPerLine = this.getPhotosPerLine()
        let lines = Math.floor(this.photos.length / this.photosPerLine)
        if (this.photos.length % this.photosPerLine !== 0) {
            lines++
        }
        for (let i = 0; i < lines; i++) {
            const div = document.createElement("div")
            div.setAttribute("id", "lineDiv=" + i)
            div.setAttribute("class", "line-div")
            this.divs.push(div)
        }
        this.divs[0].setAttribute("class", "first-line-div")
    }

    /*
    calculates photos per line in layout
    */
    static getPhotosPerLine() {
        if (this.rightToggled || this.leftToggled) {
            return 5
        }
        return 6
    }

    /*
    clears dom object and prepares for new photos
    */
    static destroyLineDivs() {
        for (const element of this.divs) {
            document.body.removeChild(element)
        }
        this.divs = []
    }
    /*
    creates filler divs for line div - only to fill blank space in divs
    */
    static createBlankPhotoDiv() {
        const blankDiv = document.createElement("div")
        blankDiv.setAttribute("class", "blank-div")
        return blankDiv
    }

}
export {
    PhotosStore
}
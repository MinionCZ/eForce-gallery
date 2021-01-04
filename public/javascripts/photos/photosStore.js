import {
    Photo
} from "./photo.js"

import {
    CheckStore
} from "./checkStore.js"
import {
    getMaxPage,
    setMaxPage,
    getPage,
    incrementHandler,
    decrementHandler
} from "./pageHandler.js"
import {
    PhotoPreview
} from "../photoPresenter/photoPreview.js"

class PhotosStore {
    static photos = []
    static allPhotosMap = new Map()
    static photosCount = 0
    static divs = []
    static leftToggled = false
    static rightToggled = false
    static photosPerLine = 0
    static liteSize = 0
    static fullSize = 0
    static photoPreview = null
    static fetchPage(page) {
        let request = new XMLHttpRequest()
        request.open("GET", "/get-all-photos?page=" + page + "&photosPerPage=" + 60, false)
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
        this.liteSize = parsedJson.liteSize
        this.fullSize = parsedJson.fullSize
        for (const photo of parsedJson.photos) {
            const parsedPhoto = new Photo(photo)
            this.photos.push(parsedPhoto)
            this.allPhotosMap.set(parsedPhoto.fileName, parsedPhoto)
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
            const div = this.photos[i].getDivForRender()
            div.onclick = (event) => {
                console.log(event.target.type)
                if (event.target.type !== "checkbox") {
                    PhotosStore.photoPreview = new PhotoPreview(this.photos[i], this.getPreviousPhoto, this.getNextPhoto, i)
                }
            }
            this.divs[Math.floor(i / this.photosPerLine)].appendChild(div)
        }
        const lastDiv = this.divs[this.divs.length - 1]
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

    /*
    sets all rendered photos as selected/not selected
    */
    static setStateOfAllPhotos(state) {
        for (const photo of this.photos) {
            photo.checkBox.checked = state
            if (state) {
                CheckStore.addCheckedPhoto(photo.fileName)
            } else {
                CheckStore.removeCheckedPhoto(photo.fileName)
            }
        }
    }
    /*
    returns photo by its name
    */
    static getPhotoByFileName(fileName) {
        if (this.allPhotosMap.has(fileName)) {
            return this.allPhotosMap.get(fileName)
        }
        return null
    }

    /*
    sums file sizes of photos in lite and full version
     */
    static sumPhotosSize(photosToSum, isAllSelected) {
        let liteSize = 0,
            fullSize = 0
        if (!isAllSelected) {
            for (const photo of photosToSum) {
                liteSize += photo.liteSize
                fullSize += photo.fullSize
            }
        } else {
            liteSize = this.liteSize
            fullSize = this.fullSize
            for (const photo of photosToSum) {
                liteSize -= photo.liteSize
                fullSize -= photo.fullSize
            }
        }
        return {
            fullSize: this.getSizeWithUnits(this.floorToTwoDigits(fullSize)),
            liteSize: this.getSizeWithUnits(this.floorToTwoDigits(liteSize))
        }
    }

    /*
    returns size of selected photos in MB or GB, depending on file sizes
     */
    static getSizeWithUnits(size) {
        if (size > 1000) {
            size /= 1000
            size = this.floorToTwoDigits(size)
            return size + "GB"
        }
        return size + "MB"
    }


    /*
    floors number to two digits if it is too long
    */
    static floorToTwoDigits(number) {
        number *= 100
        number = Math.floor(number)
        number /= 100
        return number
    }

    /*
    returns photos count
    */
    static getAllPhotosCount() {
        return this.photosCount
    }

    /*
    returns photo if it is in range, else returns null
    */
    static getPhotoAtIndex(index) {
        if (index >= 0 && index < this.photos.length) {
            return this.photos[index]
        }
        return null

    }
    /*
    gets next photo to show as preview, also checks if next photo is possible and automatically changes page
    */
    static async getNextPhoto() {
        let index = PhotosStore.photoPreview.getIndex()
        if (index + 1 < PhotosStore.photos.length) {
            index++
            const nextPhoto = PhotosStore.getPhotoAtIndex(index)
            const surroundings = PhotosStore.hasSurroundingPhotos(index)
            PhotosStore.photoPreview.setIndex(index)
            PhotosStore.photoPreview.setPhotoToPreview(nextPhoto, surroundings.previous, surroundings.next)
        } else {
            incrementHandler()
            PhotosStore.photoPreview.setIndex(0)
            const newPhoto = PhotosStore.getPhotoAtIndex(0)
            const surroundings = PhotosStore.hasSurroundingPhotos(0)
            PhotosStore.photoPreview.setPhotoToPreview(newPhoto, surroundings.previous, surroundings.next)
        }

    }
    /*
    sets previous photo to be seen on 
    */
    static getPreviousPhoto() {
        let index = PhotosStore.photoPreview.getIndex()
        if (index > 0) {
            index--
            const nextPhoto = PhotosStore.getPhotoAtIndex(index)
            const surroundings = PhotosStore.hasSurroundingPhotos(index)
            PhotosStore.photoPreview.setIndex(index)
            console.log(surroundings)
            PhotosStore.photoPreview.setPhotoToPreview(nextPhoto, surroundings.previous, surroundings.next)
        } else {
            decrementHandler()
            const index = PhotosStore.photos.length - 1
            PhotosStore.photoPreview.setIndex(index)
            const newPhoto = PhotosStore.getPhotoAtIndex(index)
            const surroundings = PhotosStore.hasSurroundingPhotos(index)
            PhotosStore.photoPreview.setPhotoToPreview(newPhoto, surroundings.previous, surroundings.next)
        }
    }
    /*
    returns if current photo has surrounding, and on which side they are
    */
    static hasSurroundingPhotos(index) {
        return {
            previous: !(index === 0 && getPage() === 1),
            next: !((this.photos.length - 1) === index && (getPage() === getMaxPage()))
        }


    }
}
export {
    PhotosStore
}
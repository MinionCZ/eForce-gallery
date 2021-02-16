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
import { SideBarsStore } from "./sideBarsStore.js"
import { createPopupWindow } from "./layoutGenerator.js"

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
    static async fetchPage(page) {
        const photosQuery = SideBarsStore.exportData()
        const data = {
            page: page,
            tags: photosQuery.tags,
            galleries: photosQuery.galleries,
            tagsState: photosQuery.tagsState,
            galleriesState: photosQuery.galleriesState
        }
        const response = await fetch("/eforce-gallery/get-all-photos", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        this.fillPhotosArray((await response.json()).photos)
    }

    /*
    fills array with photos from backend
    */
    static async fillPhotosArray(json) {
        this.photos = []
        this.photosCount = json.photosCount
        setMaxPage(this.photosCount)
        if(this.photosCount === 0){
            createPopupWindow("There are no photos to be seen...")
            this.destroyLineDivs()
        }else{
            this.liteSize = json.liteSize
            this.fullSize = json.fullSize
            for (const photo of json.photos) {
                const parsedPhoto = new Photo(photo)
                this.photos.push(parsedPhoto)
                this.allPhotosMap.set(parsedPhoto.fileName, parsedPhoto)
            }
            this.renderPhotos()
        }
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
        if(this.photos.length === 0){
            return
        }
        this.destroyLineDivs()
        this.createPhotoDivs()
        for (let i = 0; i < this.photos.length; i++) {
            const div = this.photos[i].getDivForRender()
            div.onclick = (event) => {
                console.log(event.target.type)
                if (event.target.type !== "checkbox") {
                    const surroundings = PhotosStore.hasSurroundingPhotos(i)
                    PhotosStore.photoPreview = new PhotoPreview(this.photos[i], this.getPreviousPhoto, this.getNextPhoto, i, this.refreshPageCallback, surroundings.previous, surroundings.next)
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
            if (this.photosPerLine === 6 || this.photosPerLine === 4) {
                div.setAttribute("class", "line-div")
            } else {
                if (this.rightToggled) {
                    div.setAttribute("class", "line-div right")
                } else {
                    div.setAttribute("class", "line-div left")
                }
            }
            this.divs.push(div)
        }
        if (this.photosPerLine === 6 || this.photosPerLine === 4) {
            this.divs[0].setAttribute("class", "first-line-div")
        } else {
            if (this.rightToggled) {
                this.divs[0].setAttribute("class", "first-line-div right")
            } else {
                this.divs[0].setAttribute("class", "first-line-div left")
            }
        }
    }

    /*
    calculates photos per line in layout
    */
    static getPhotosPerLine() {
        if (this.rightToggled && this.leftToggled) {
            return 4
        } else if (this.rightToggled || this.leftToggled) {
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

    /*
    serves as callback for deleting photo to refresh actual page, or returns to the previous
    first part solves problems when there is only one photo on the page
    second part solves problems when is it on last page and there will be problem with index, because it will not exists and when the index exists
     */
    static refreshPageCallback() {
        let page = getPage()
        let index = PhotosStore.photoPreview.getIndex()
        if (page > 1 && PhotosStore.photos.length === 1) {
            page--
            PhotosStore.fetchPage(page)
            index = PhotosStore.photos.length - 1
            const surroundings = PhotosStore.hasSurroundingPhotos(index)
            const newPhoto = PhotosStore.getPhotoAtIndex(index)
            PhotosStore.photoPreview.setPhotoToPreview(newPhoto, surroundings.previous, surroundings.next)
            return
        } else if (page === 1 && PhotosStore.photos.length === 1) {
            PhotosStore.fetchPage(page)
            PhotosStore.photoPreview.deletePreview()
            PhotosStore.photoPreview = null
            return
        }

        if (page === getMaxPage() && index === (PhotosStore.photos.length - 1)) {
            index--
        }
        PhotosStore.fetchPage(page)
        const surroundings = PhotosStore.hasSurroundingPhotos(index)
        const newPhoto = PhotosStore.getPhotoAtIndex(index)
        PhotosStore.photoPreview.setPhotoToPreview(newPhoto, surroundings.previous, surroundings.next)
    }


}
export {
    PhotosStore
}
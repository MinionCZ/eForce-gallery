import { PhotoPreview } from "../../photoPresenter/photoPreview.js"
import {
    GalleryStore
} from "../galleryStore.js"
import { refreshLayout, updateActualPageInput } from "../sideBar/photoPageButtons.js"
import { PhotoObject } from "./photoObject.js"
import {
    buildLayout,
    getPhotoLayoutByFilename,
    tagAllPhotosInLayout
} from "./photoPageGenerator.js"
class PhotoStore {
    static allPhotos = []
    static taggedPhotos = new Set()
    static pages = 0
    static actualPage = 1
    static allPhotosTagged = false
    static taggedPages = new Set()
    static sizeMap = new Map()
    static preview = null
    static async obtainAllPhotos() {
        this.allPhotos = GalleryStore.getGallery().photos
        this.pages = this.calculatePages()
        if (this.actualPage > this.pages) {
            this.actualPage = this.pages
        }
        this.sizeMap = await this.fetchPhotoSizes()
    }
    static getAllPhotos() {
        return this.allPhotos
    }
    static getAllTaggedPhotos() {
        return Array.from(this.taggedPhotos)
    }
    static addTaggedPhoto(photo) {
        this.taggedPhotos.add(photo)
    }
    static isPhotoTagged(photo) {
        return this.taggedPhotos.has(photo)
    }
    static tagAllPhotos() {
        this.taggedPhotos = new Set(this.allPhotos)
        this.allPhotosTagged = true
        tagAllPhotosInLayout()
    }
    static unTagAllPhotos() {
        this.taggedPhotos = new Set()
        this.allPhotosTagged = false
        tagAllPhotosInLayout()
    }

    static calculatePages() {
        let rest = this.allPhotos.length % 60
        let pages = this.allPhotos.length - rest
        pages /= 60
        if (rest !== 0) {
            pages++
        }
        return pages
    }
    static getActualPage() {
        return this.actualPage
    }
    static setActualPage(page) {
        this.actualPage = page
    }
    static getPhotosForPage() {
        const photosToPage = []
        if (this.actualPage < this.pages) {
            for (let i = 60 * (this.actualPage - 1); i < 60 * this.actualPage; i++) {
                photosToPage.push(this.allPhotos[i])
            }
        } else {
            for (let i = 60 * (this.actualPage - 1); i < this.allPhotos.length; i++) {
                photosToPage.push(this.allPhotos[i])
            }
        }
        return photosToPage
    }
    static getMaxPage() {
        return this.pages
    }

    static areAllPhotosTagged() {
        return this.allPhotosTagged
    }


    static toggleTagOnPhoto(filename) {
        if (this.taggedPhotos.has(filename)) {
            this.taggedPhotos.delete(filename)
            if (this.taggedPhotos.size === 0) {
                this.allPhotosTagged = false
                document.getElementById("selectAllPhotosButton").innerText = "Select all photos"
            }
            if (!this.isAnyTaggedPhotoOnPage()) {
                document.getElementById("selectAllPhotosOnPageButton").innerText = "Select all photos on page"
                this.taggedPages.delete(this.actualPage)
            }
        } else {
            this.taggedPhotos.add(filename)
        }
    }

    static tagAllPhotosOnPage() {
        for (const photo of this.getPhotosForPage()) {
            this.taggedPhotos.add(photo)
        }
        this.taggedPages.add(this.actualPage)
        tagAllPhotosInLayout()
    }
    static isPageTagged() {
        return this.taggedPages.has(this.actualPage)
    }
    static unTagAllPhotosOnPage() {
        for (const photo of this.getPhotosForPage()) {
            this.taggedPhotos.delete(photo)
        }
        this.taggedPages.delete(this.actualPage)
        tagAllPhotosInLayout()
    }

    static isAnyTaggedPhotoOnPage() {
        let taggedPhoto = false
        for (const photo of this.getPhotosForPage()) {
            if (this.taggedPhotos.has(photo)) {
                taggedPhoto = true
                break
            }
        }
        return taggedPhoto
    }
    static areAllPhotosTaggedOnPage() {
        let taggedPhoto = true
        for (const photo of this.getPhotosForPage()) {
            if (!this.taggedPhotos.has(photo)) {
                taggedPhoto = false
                break
            }
        }
        return taggedPhoto
    }
    static calculateSizeOfSelectedPhotos() {
        let liteSize = 0
        let fullSize = 0
        for (const photo of this.taggedPhotos) {
            const actualSizes = this.sizeMap.get(photo)
            liteSize += actualSizes.liteSize
            fullSize += actualSizes.fullSize
        }
        return {
            liteSize: this.cropLengthOfSizes(liteSize),
            fullSize: this.cropLengthOfSizes(fullSize)
        }
    }
    static cropLengthOfSizes(size) {
        let newSize = parseFloat(size)
        let units = "MB"
        if (newSize > 1000) {
            newSize /= 1000
            units = "GB"
        }
        newSize *= 100
        newSize = Math.floor(newSize)
        newSize /= 100
        return newSize + units
    }
    static async fetchPhotoSizes() {
        const response = await fetch("/eforce-gallery/gallery-manager/fetch-all-photos-sizes", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ photos: this.allPhotos })
        })
        const parsed = await response.json()
        const sizeMap = new Map()
        for (const photo of parsed.photos) {
            sizeMap.set(photo.filename, { liteSize: photo.liteSize, fullSize: photo.fullSize })
        }
        return sizeMap
    }

    static getIndexOfPhoto(filename) {
        return this.getPhotosForPage().indexOf(filename)
    }
    static getPhotoAtIndex(index) {
        const photosOnPage = PhotoStore.getPhotosForPage()
        if (index < photosOnPage.length) {
            return photosOnPage[index]
        }
        return null
    }
    static getPreview() {
        return this.preview
    }
    static createNewPreview(photo, checkBox, index) {
        const photoObject = new PhotoObject(photo, checkBox)
        PhotoStore.preview = new PhotoPreview(photoObject, this.getLastPhoto, this.getNextPhoto, index, null, PhotoStore.isLast(index), PhotoStore.isNext(index))
    }
    static getLastPhoto() {
        let index = PhotoStore.preview.getIndex()
        if (index > 1) {
            index--
            PhotoStore.setPreview(index, true, true)
        } else {
            if (PhotoStore.actualPage === 1) {
                index--
                PhotoStore.setPreview(index, false, true)
            } else {
                PhotoStore.actualPage--
                buildLayout()
                PhotoStore.setPreview(59, true, true)
                updateActualPageInput()
            }
        }

    }
    static getNextPhoto() {
        let index = PhotoStore.preview.getIndex()
        if (index < 58) {
            index++
            PhotoStore.setPreview(index, true, PhotoStore.isNext(index))
        }else{
            if(PhotoStore.actualPage !== PhotoStore.getMaxPage()){
                PhotoStore.actualPage++
                buildLayout()
                PhotoStore.setPreview(0, true, PhotoStore.isNext(index))
                updateActualPageInput()
            }else{
                PhotoStore.setPreview(0, true, PhotoStore.isNext(index))
            }
        }
    }
    static setPreview(index, isLast, isNext) {
        PhotoStore.preview.setIndex(index)
        const photo = PhotoStore.getPhotoAtIndex(index)
        const photoLayout = getPhotoLayoutByFilename(photo)
        const photoObject = new PhotoObject(photo, photoLayout.checkBox)
        PhotoStore.preview.setPhotoToPreview(photoObject, isLast, isNext)
    }
    static isNext(index){
        index++
        return index < (this.getPhotosForPage().length - 1)
    }

    static isLast(index){
        index--
        if(index >= 0){
            return true
        }else{
            return this.actualPage !== 1
        }


    }
}




export {
    PhotoStore
}
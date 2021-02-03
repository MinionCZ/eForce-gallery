import {
    GalleryStore
} from "../galleryStore.js"

class PhotoStore {
    static allPhotos = []
    static taggedPhotos = new Set()
    static pages = 0
    static actualPage = 1
    static obtainAllPhotos() {
        console.log(GalleryStore.getGallery())
        this.allPhotos = GalleryStore.getGallery().photos
        this.pages = this.calculatePages()
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
    }
    static unTagAllPhotos() {
        this.taggedPhotos = new Set()
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
    static getMaxPage(){
        return this.pages
    }
}
export {
    PhotoStore
}
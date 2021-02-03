import {
    GalleryStore
} from "../galleryStore.js"

class PhotoStore {
    static allPhotos = []
    static taggedPhotos = new Set()
    static pages = this.calculatePages()
    static actualPage = 1
    static obtainAllPhotos() {
        this.allPhotos = GalleryStore.getGallery().photos
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
        let pages = this.allPhotos.length / 60
        const newLen = this.allPhotos.length - 60 * pages
        if (newLen !== 0) {
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
    static getPhotosForPage(page) {
        const photosToPage = []
        if (page < this.pages) {
            for (let i = 60 * (page - 1); i < 60 * page; i++) {
                photosToPage.push(this.allPhotos[i])
            }
        } else {
            for (let i = 60 * (page - 1); i < this.allPhotos.length; i++) {
                photosToPage.push(this.allPhotos[i])
            }
        }
        return photosToPage
    }
}
export {
    PhotoStore
}
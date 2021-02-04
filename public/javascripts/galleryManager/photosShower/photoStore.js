import {
    GalleryStore
} from "../galleryStore.js"
import{
    tagAllPhotosInLayout
}from "./photoPageGenerator.js"
class PhotoStore {
    static allPhotos = []
    static taggedPhotos = new Set()
    static pages = 0
    static actualPage = 1
    static allPhotosTagged = false
    static taggedPages = new Set()
    static obtainAllPhotos() {
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
    static getMaxPage(){
        return this.pages
    }

    static areAllPhotosTagged(){
        return this.allPhotosTagged
    }


    static toggleTagOnPhoto(filename){
        if(this.taggedPhotos.has(filename)){
            this.taggedPhotos.delete(filename)
            if(this.taggedPhotos.size === 0){
                this.allPhotosTagged = false
                document.getElementById("selectAllPhotosButton").innerText = "Select all photos"
            }
            if(!this.isAnyTaggedPhotoOnPage()){
                document.getElementById("selectAllPhotosOnPageButton").innerText = "Select all photos on page"
                this.taggedPages.delete(this.actualPage)
            }

        }else{
            this.taggedPhotos.add(filename)
        }
    }

    static tagAllPhotosOnPage(){
        for(const photo of this.getPhotosForPage()){
            this.taggedPhotos.add(photo)
        }
        this.taggedPages.add(this.actualPage)
        tagAllPhotosInLayout()
    }
    static isPageTagged(){
        return this.taggedPages.has(this.actualPage)
    }
    static unTagAllPhotosOnPage(){
        for(const photo of this.getPhotosForPage()){
            this.taggedPhotos.delete(photo)
        }
        this.taggedPages.delete(this.actualPage)
        tagAllPhotosInLayout()
    }

    static isAnyTaggedPhotoOnPage(){
        let taggedPhoto = false
        for(const photo of this.getPhotosForPage()){
            if(this.taggedPhotos.has(photo)){
                taggedPhoto = true
                break
            }
        }
        return taggedPhoto
    }
    static areAllPhotosTaggedOnPage(){
        let taggedPhoto = true
        for(const photo of this.getPhotosForPage()){
            if(!this.taggedPhotos.has(photo)){
                taggedPhoto = false
                break
            }
        }
        return taggedPhoto
    }


}
export {
    PhotoStore
}
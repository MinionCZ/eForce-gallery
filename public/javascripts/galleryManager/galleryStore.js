import{
    Gallery
} from "./gallery.js"
class GalleryStore{
    static gallery = null
    static getGallery(){
        return this.gallery
    }
    static buildNewGallery(dataInJson){
        this.gallery = new Gallery(dataInJson)
        return this.gallery
    }
}
export{
    GalleryStore
}
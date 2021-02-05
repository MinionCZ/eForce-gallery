import{
    Gallery
} from "./gallery.js"
class GalleryStore{
    static gallery = null
    static oldGallery = null
    static galTitles = null
    static root = document.createElement("div")
    static tags = []
    /*
    returns root element of layout
    */
    static getRoot(){
        if(!document.body.contains(this.root)){
            document.body.appendChild(this.root)
        }
        this.root.setAttribute("class", "root-element")
        return this.root
    }
    /*
    clears root
    */
    static clearRoot(){
        this.root.innerHTML = ""
    }
    /*
    sets gallery titles
    */
    static setGalTitles(galTitles){
        this.galTitles = galTitles
    }
    /*
     gets Gallery Titles
    */
    static getGalTitles(){
        return this.galTitles
    }
    /*
    gets gal titles
    */
    static getGallery(){
        return this.gallery
    }
    /*
    builds new gallery from data from server
    */
    static buildNewGallery(dataInJson){
        this.gallery = new Gallery(dataInJson)
        this.oldGallery = new Gallery(dataInJson)
        return this.gallery
    }
    /*
    returns old version of this gallery fetched from server
    */
    static getOldGallery(){
        return this.oldGallery
    }
    /*
    sets tags
    */
    static setTags(tags){
        this.tags = tags
    }
    /*
    get tags
    */
    static getTags(){
        return this.tags
    }

}
export{
    GalleryStore
}
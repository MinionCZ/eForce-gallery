import{
    Gallery
} from "./gallery.js"
class GalleryStore{
    static gallery = null
    static galTitles = null
    static root = document.createElement("div")

    static getRoot(){
        if(!document.body.contains(this.root)){
            document.body.appendChild(this.root)
        }
        this.root.setAttribute("class", "root-element")
        return this.root
    }
    static clearRoot(){
        this.root.innerHTML = ""
    }
    static setGalTitles(galTitles){
        this.galTitles = galTitles
    }
    static getGalTitles(galTitles){
        return this.galTitles
    }
    
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
import {Photo} from "./photo.js"
class PhotosStore {
    static photos = []
    static photosCount = 0
    static divs = []
    static leftToggled = false
    static rightToggled = false
    static photosPerLine = 0
    static fetchPage(page, photosPerPage) {
        let request = new XMLHttpRequest()
        request.open("GET", "/get-all-photos?page=" + page + "&photosPerPage=" + photosPerPage)
        request.onload = () => {
            this.fillPhotosArray(request.responseText)
        }
        request.send();
    }
/*
fills array with photos from backend
*/


    static fillPhotosArray(json){
        this.photos = []
        const parsedJson = JSON.parse(json)
        this.photosCount = parsedJson.photosCount
        for(const photo of parsedJson.photos){
            this.photos.push(new Photo(photo))
        }
        this.renderPhotos()
    }
    /*
    sets state of sidebar, true if it is open, false if it is closed
    */
    static setToggleState(state, barValue){
        if (barValue === "tags"){
            this.rightToggled = state
        }else{
            this.leftToggled = state
        }
    }
    /*
    get state of sidebar
    */
    static getToggleState(barValue){
        if (barValue === "tags"){
            return this.rightToggled
        }
        return this.leftToggled
    }

    /*
    renders photos from photo array
    */
    static renderPhotos(){
        this.createPhotoDivs()
        //console.log(this.divs[0], 0/this.photosPerLine)
        for (let i = 0; i < this.photos.length; i++){
            this.divs[Math.floor(i / this.photosPerLine)].appendChild(this.photos[i].getDivForRender())
        }
        for (const div of this.divs){
            document.body.appendChild(div)
        }
    }

    /*
    creates line divs for layout
    */
    static createPhotoDivs(){
        this.photosPerLine = this.getPhotosPerLine()
        let lines = Math.floor(this.photos.length / this.photosPerLine)
        if(this.photos.length % this.photosPerLine !== 0){
            lines++
        }
        for (let i = 0; i < lines; i++){
            const div = document.createElement("div")
            div.setAttribute("id", "lineDiv=" + i)
            div.setAttribute("class", "lineDiv")
            this.divs.push(div)
        }
    }

    /*
    calculates photos per line in layout
    */
    static getPhotosPerLine(){
        if (this.rightToggled && this.leftToggled){
            return 4
        }else if(this.rightToggled && this.leftToggled){
            return 5
        }
        return 6
    }


}
export {
    PhotosStore
}
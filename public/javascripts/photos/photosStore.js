import {Photo} from "./photo.js"
class PhotosStore {
    static photos = []
    static photosCount = 0
    static fetchPage(page, photosPerPage) {
        let request = new XMLHttpRequest()
        request.open("GET", "/get-all-photos?page=" + page + "&photosPerPage=" + photosPerPage)
        request.onload = () => {
            this.fillPhotosArray(request.responseText)
        }
        request.send();
    }
    static fillPhotosArray(json){
        this.photos = []
        const parsedJson = JSON.parse(json)
        this.photosCount = parsedJson.photosCount
        for(const photo of parsedJson.photos){
            this.photos.push(new Photo(photo))
        }
        console.log(this.photos)
    }



}
export {
    PhotosStore
}
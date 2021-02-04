class PhotoObject{
    constructor(filename, checkBox){
        this.fileName = filename
        this.checkBox = checkBox
    }
    getImageLink(thumbnail = false){
        return "/eforce-gallery/photos/fetch-photo-by-id?fileName=" + this.fileName + "&thumbnail=" + thumbnail
    }
}
export{
    PhotoObject
}
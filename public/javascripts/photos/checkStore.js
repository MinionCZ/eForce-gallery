class CheckStore {
    static checkedPhotos = new Set()
    static addCheckedPhoto(fileName) {
        this.checkedPhotos.add(fileName)
    }
    static removeCheckedPhoto(fileName) {
        this.checkedPhotos.delete(fileName)
    }
    static isPhotoChecked(fileName){
        return this.checkedPhotos.has(fileName)
    }
}
export{
    CheckStore
}
import {
    PhotosStore
} from "./photosStore.js"
class CheckStore {
    static checkedPhotos = new Set()
    static allSelected = false
    static excludedPhotos = new Set()
    /*
    adds checked photo to set
     */
    static addCheckedPhoto(fileName) {
        if (this.allSelected) {
            this.excludedPhotos.delete(fileName)
        } else {
            this.checkedPhotos.add(fileName)
        }
    }

    /*
    remove checked photo from set
    */
    static removeCheckedPhoto(fileName) {
        if (this.allSelected) {
            this.excludedPhotos.add(fileName)
        } else {
            this.checkedPhotos.delete(fileName)
        }
    }
    /*
    returns if photo is checked, for checkboxes on front end
    */
    static isPhotoChecked(fileName) {
        if (this.allSelected) {
            return !this.excludedPhoto.has(fileName)
        }
        return this.checkedPhotos.has(fileName)
    }
    /*
    toggles all selected variable, and create excluded photos set
    */
    static toggleAllSelected() {
        this.allSelected = !this.allSelected
        if (!this.allSelected) {
            this.excludedPhotos = new Set()
        }
        this.checkedPhotos = new Set()
        PhotosStore.setStateOfAllPhotos(this.allSelected)
    }

}
export {
    CheckStore
}
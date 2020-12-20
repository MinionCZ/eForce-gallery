import {
    PhotosStore
} from "./photosStore.js"
import{
    topButtonsDisable
}from "./topSelectorHandler.js"
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
        if (this.checkedPhotos.size > 0 || this.excludedPhotos.size > 0){
            topButtonsDisable(false)
            
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
        if (this.checkedPhotos.size === 0 && this.excludedPhotos.size === PhotosStore.photosCount){
            topButtonsDisable(true)
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
        topButtonsDisable(!this.allSelected)
    }

    /*
    returns selected photos depending on if all is selected
    if all is selected returns array with which are excluded from all selector
    else returns array with selected photos
    */
    static getSelectedPhotos(){
        const photosToReturn = []
        if(!this.allSelected){
            for(const photo of this.checkedPhotos){
                photosToReturn.push(PhotosStore.getPhotoByFileName(photo))
            }
        }else{
            for(const photo of this.excludedPhotos){
                photosToReturn.push(PhotosStore.getPhotoByFileName(photo))
            }
        }
        return {photos: photosToReturn, allSelected:this.allSelected}
    }







}
export {
    CheckStore
}
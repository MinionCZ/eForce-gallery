import {
    Gallery
} from "./gallery.js"

class GalleryStore {
    static galleries = []
    static tagSet = new Set()
    static tagMap = new Map()
    static addGallery(gallery) {
        this.galleries.push(gallery)
        for (const tag of gallery.tags) {
            this.tagSet.add(tag)
        }
    }
    static getAllGalleries() {
        return this.galleries
    }
    static dateToNumber(date) {
        let splitted = date.split(".")
        let year = parseInt(splitted[2]) * 10000
        let month = parseInt(splitted[1]) * 100
        let day = parseInt(splitted[0])
        return year + month + day
    }
    static getAllTags() {
        return Array.from(this.tagSet)
    }
    static getTaggedMap(){
        if(this.tagMap.size === 0){
            this.tagMap = this.buildTagMap()
        }
        return this.tagMap
    }

    static buildTagMap(){
        const localMap = new Map()
        for(const tag of this.tagSet){
            let mapArray = []
            for(const gallery of this.galleries){
                if(gallery.hasTag()){
                    mapArray.push(gallery)
                }
            }
            localMap.set(tag, mapArray)
        }
        return localMap
    }
}


export {
    GalleryStore
}
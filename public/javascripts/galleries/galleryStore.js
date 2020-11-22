import {
    Gallery
} from "./gallery.js"

class GalleryStore {
    static galleries = []
    static tagSet = new Set()
    static tagMap = new Map()
    static tagColors = new Map()
    static colors = []
    static colorsInUse = new Set()
    static colorTagMap = new Map()
    static fetchTagColors(){
        const request = new XMLHttpRequest()
        request.open("GET", "/photo-gallery/get-all-tags-colors")
        request.onload = () =>{
            this.colors = JSON.parse(request.responseText)
            this.colors = JSON.parse(this.colors)
        }
        request.send()
    }
    
    static getTagColor(){
        let randColor = Math.floor(Math.random()*this.colors.length)
        while (this.colorsInUse.has(this.colors[randColor])){
            randColor = Math.floor(Math.random()*this.colors.length)
        }
        this.colorsInUse.add(this.colors[randColor])
        console.log(this.colorsInUse.size)
        return this.colors[randColor]
    }
    static freeTagColor(tag){
        let color = this.colorTagMap.get(tag)
        this.colorTagMap.delete(tag)
        this.colorsInUse.delete(color)
    }

    static getColorForTag(tag){
        if(!this.colorTagMap.has(tag)){
            this.colorTagMap.set(tag, this.getTagColor())
        }
        return this.colorTagMap.get(tag)
    }


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
                if(gallery.hasTag(tag)){
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
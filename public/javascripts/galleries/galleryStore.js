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
    static freeTagColor(color){
        console.log(color)
        const allowedTypes = new Set("0123456789,")
        let colorString = ""
        for (const ch of color){
            if(allowedTypes.has(ch)){
                colorString += ch
            }
        }
        let numbers = colorString.split(",")
        let colorInHex = "#"
        for (const num of numbers){
            colorInHex += this.decToHTMLHex(parseInt(num))
        }
        this.colorsInUse.delete(colorInHex)
    }

    static decToHTMLHex(number){
        const hexChars = "0123456789ABCDEF".split("")
        console.log(hexChars.length)
        let hex = ""
        while(number > 1){
            let modulo = number%16
            hex += hexChars[modulo]
            number -= modulo
            number /= 16
        }

        while(hex.length < 2){
            hex += "0"
        }
        let helpHex = hex.split("").reverse()
        hex = ""
        for (let ch of helpHex){
            hex += ch
        }
        return hex
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
import{
    GallerySort
} from "./gallerySort.js"
import { GalleryStore } from "./galleryStore.js"
import {GalleryRender} from "./galleryRender.js"
class Gallery {
    constructor(gallery) {
        this.title = gallery.title
        this.tags = gallery.tags
        this.eventDate = gallery.eventDate
        this.contributionDate = gallery.contributionDate
        this.changeDate = gallery.changeDate
        this.photosCount = gallery.photos
        this.contributor = gallery.contributor
        this.lastChanges = gallery.lastChanges
        this.label = gallery.label
        this.photoURL = "/photo-gallery/get-photo?title=" + gallery.title
        this.searchWords = this.generateSearchWords()
        this.isRendered = true
        this.tagButtons = new Map()
    }

    generateSearchWords() {
        let words = []
        words.push(this.title)
        words.push(this.eventDate)
        words.push(this.contributionDate)
        words.push(this.contributor)
        words = words.concat(this.tags)
        words = words.concat(this.splitLabel(this.label))
        return words
    }

    splitLabel(label) {
        let words = []
        let word = ""
        const splits = ",. (){}[];?!"
        for (let char of label) {
            if (splits.includes(char)) {
                if (word.length > 0) {
                    words.push(word.toLowerCase())
                }
                word = ""
            } else {
                word += char
            }
        }
        if (word.length > 0) {
            words.push(word)
        }
        return words
    }


    searchForHighlightedWords(search) {
        const foundWords = []
        const searchString = search.toLowerCase()
        for (let word of this.searchWords) {
            if (word === searchString) {
                foundWords.push(search)
            } else if (word.length > searchString.length) {
                let res = word.substr(0, searchString.length)
                if (res === searchString) {
                    foundWords.push(word)
                }
            }
        }
        return {
            isHighlighted: foundWords.length > 0,
            highlightedWords: foundWords
        }
    }
    renderDiv() {
        const div = document.createElement("div")
        div.setAttribute("class", "galleryDiv")

        const title = document.createElement("h2")
        title.textContent = this.title
        title.setAttribute("class", "galleryTitle")

        const imageDiv = document.createElement("div")
        imageDiv.setAttribute("class", "imageDiv")

        const photo = document.createElement("img")
        photo.setAttribute("src", this.photoURL)
        photo.setAttribute("class", "galleryThumbnail")

        div.appendChild(title)
        div.appendChild(imageDiv)
        imageDiv.appendChild(photo)
        div.appendChild(this.generateStatsDiv())
        const tagDivs = this.generateTagDiv()
        for (let tagDiv of tagDivs) {
            div.appendChild(tagDiv)
        }


        return div
    }


    generateStatsDiv(){
        const statsDiv = document.createElement("div")
        let photosCount = ""
        if(this.photosCount === 0){
            photosCount = "empty"
        }else{
            photosCount = this.photosCount
        }
        statsDiv.setAttribute("class", "statsDiv")
        statsDiv.innerHTML = "Contributor: " + this.contributor
        statsDiv.innerHTML += "<br>" + "Number of photos: " + photosCount
        statsDiv.innerHTML += "<br>" + "Date of event: " + this.eventDate
        statsDiv.innerHTML += "<br>" + "Date of contribution: " + this.contributionDate
        return statsDiv

    }

    generateTagDiv() {
        const tagLines = []
        let mainIndex = 0
        let div = document.createElement("div")
        div.setAttribute("class", "tagLine")
        tagLines.push(div)
        for (let tag of this.tags) {
            if (mainIndex == 3) {
                mainIndex = 0
                div = document.createElement("div")
                div.setAttribute("class", "tagLine")
                tagLines.push(div)
            }
            mainIndex++
            div.appendChild(this.generateTag(tag))
        }
        tagLines[tagLines.length - 1].setAttribute("class", "tagLineLast")
        return tagLines
    }

    generateTag(tag) {
        const tagBtn = document.createElement("button")
        tagBtn.setAttribute("class", "tag")
        this.tagButtons.set(tag, tagBtn)
        tagBtn.onclick = () =>{
            let backgroundColor = ""
            if(GallerySort.toggleTag(tag)){
                backgroundColor = GalleryStore.getTagColor()
            }else{
                let color = tagBtn.style.backgroundColor
                GalleryStore.freeTagColor(color)
                backgroundColor = "lightgray"
            }
            tagBtn.style.backgroundColor = backgroundColor
            GallerySort.handleQueryChange()
            GalleryRender.setTagButtonColor(tag, backgroundColor)
            console.log(tag)
        }
        tagBtn.textContent = tag
        return tagBtn
    }

    hasTag(tag){
        let hasTag = false
        for (let i = 0; i < this.tags.length; i++){
            if(this.tags[i] === tag){
                hasTag = true
                break
            }
        }
        return hasTag
    }

    changeTagColor(tag, color){
        this.tagButtons.get(tag).style.backgroundColor = color
    }



}
export {
    Gallery
}
import {
    GallerySort
} from "./gallerySort.js"
import{
    GalleryPreview
}from "./galleryPreview.js"
class Gallery {
    constructor(gallery) {
        this.title = gallery.title
        this.tags = gallery.tags
        this.id = gallery.galleryID
        this.eventDate = gallery.eventDate
        this.contributionDate = gallery.contributionDate
        this.changeDate = gallery.changeDate
        this.photosCount = gallery.photos
        this.contributor = gallery.contributor
        this.lastChanges = gallery.lastChanges
        this.label = gallery.label
        this.photoURL = "/photo-gallery/get-photo?galleryID=" + this.id
        this.searchWords = this.generateSearchWords()
        this.isRendered = true
        this.tagButtons = new Map()
        this.componentsToHighlight = []
    }

    generateSearchWords() {
        let words = []
        words.push(this.title)
        words.push(this.eventDate)
        words.push(this.contributionDate)
        words.push(this.contributor)
        words = words.concat(this.tags)
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
        this.componentsToHighlight.push(title)
        div.appendChild(title)
        div.appendChild(imageDiv)
        imageDiv.appendChild(photo)
        div.appendChild(this.generateStatsDiv())
        const tagDivs = this.generateTagDiv()
        for (let tagDiv of tagDivs) {
            div.appendChild(tagDiv)
        }
        div.onclick = (event) =>{
            if(event.target.getAttribute("class") !== "tag"){
                GalleryPreview.createPreview(this)
            }
        }
        return div
    }


    generateStatsDiv() {
        const statsDiv = document.createElement("div")
        let photosCount = ""
        if (this.photosCount === 0) {
            photosCount = "empty"
        } else {
            photosCount = this.photosCount
        }
        statsDiv.setAttribute("class", "statsDiv")
        const table = document.createElement("table")
        table.setAttribute("class", "statsTable")
        table.appendChild(this.generateStatsTableRow("Contributor: ", this.contributor))
        table.appendChild(this.generateStatsTableRow("Number of photos: ", this.photosCount))
        table.appendChild(this.generateStatsTableRow("Event date: ", this.eventDate))
        table.appendChild(this.generateStatsTableRow("ContributionDate: ", this.contributionDate))
        statsDiv.appendChild(table)
        return statsDiv
    }

    generateStatsTableRow(text, value) {
        const tr = document.createElement("tr")
        const label = document.createElement("th")
        label.textContent = "" + text
        const valueText = document.createElement("th")
        valueText.textContent = "" + value
        tr.appendChild(label)
        tr.appendChild(valueText)
        this.componentsToHighlight.push(valueText)
        return tr
    }

    generateTagDiv() {
        const tagLines = []
        let mainIndex = 0
        let div = document.createElement("div")


        div.setAttribute("class", "tagLine")
        tagLines.push(div)
        for (let tag of this.tags) {
            if(tag === ""){
                continue
            }
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
        if (this.tags.length === 1 && this.tags[0] === ""){
            div.setAttribute("class", "noTagDiv")
            const title = document.createElement("h3")
            title.textContent = "This gallery has no tags"
            div.appendChild(title)
            tagLines.push(div)
        }
        return tagLines
    }

    generateTag(tag) {
        const tagBtn = document.createElement("button")
        tagBtn.setAttribute("class", "tag")
        this.tagButtons.set(tag, tagBtn)
        tagBtn.onclick = () => {
            GallerySort.toggleTag(tag)
            GallerySort.handleQueryChange()
        }
        tagBtn.textContent = tag
        this.componentsToHighlight.push(tagBtn)
        return tagBtn
    }

    hasTag(tag) {
        let hasTag = false
        for (let i = 0; i < this.tags.length; i++) {
            if (this.tags[i] === tag) {
                hasTag = true
                break
            }
        }
        return hasTag
    }

    changeTagColor(tag, color) {
        console.log(tag)
        this.tagButtons.get(tag).style.backgroundColor = color
    }

    highlightText(stringToHighlight){
        if (stringToHighlight === ""){
            return
        }
        stringToHighlight = stringToHighlight.toLowerCase()
        for(const component of this.componentsToHighlight){
            let highlight = this.getHighlightedText(stringToHighlight, component.textContent)
            if(highlight.isHighlighted){
                component.innerHTML = "<mark>" + highlight.highlight + "</mark>" + highlight.rest
            }
        }

    }

    getHighlightedText(stringToHighlight, mainString){
        let isHighlighted = true
        for(let i = 0; i < stringToHighlight.length; i++){
            if(stringToHighlight[i] !== mainString[i]){
                isHighlighted = false
                break
            }
        }

        if (isHighlighted){
            return {
                isHighlighted: isHighlighted,
                highlight:stringToHighlight,
                rest:mainString.substring(stringToHighlight.length, mainString.length)
            }
        }
        return{
            isHighlighted:isHighlighted
        }

    }


}
export {
    Gallery
}
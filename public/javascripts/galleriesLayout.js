const galleries = []


function createLayout(galleries) {
    console.log(galleries)
    fetchGalleriesInfo()
}

function fetchGalleriesInfo() {
    var request = new XMLHttpRequest()
    request.addEventListener("load", handleGalleryInformation)
    request.open("GET", "/galleries/get-all")
    request.send()
}


function handleGalleryInformation() {
    let galleriesInfo = JSON.parse(this.responseText)
    console.log(galleriesInfo)
    for (const gal of galleriesInfo) {
        galleries.push(new Gallery(gal))
    }


}
class Gallery {
    constructor(gallery) {
        this.title = gallery.title
        this.tags = gallery.tags
        this.eventDate = gallery.eventDate
        this.contributionDate = gallery.contributionDate
        this.changeDate = gallery.changeDate
        this.photosCount = gallery.photosCount
        this.contributor = gallery.contributor
        this.lastChanges = gallery.lastChanges
        this.label = gallery.label
        //this.firstPhoto = firstPhoto
        this.searchWords = this.generateSearchWords()
        this.isRendered = true
        console.log(this.searchForHighlightedWords("20"))
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
}
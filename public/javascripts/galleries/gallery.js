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
        this.fetchPhoto()
        this.searchWords = this.generateSearchWords()
        this.isRendered = true
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

    fetchPhoto() {
        let request = new XMLHttpRequest()
        var params = JSON.stringify({
            galleryTitle: this.title
        });
        request.open("POST", "/photo-gallery/get-photo", true)
        request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        request.responseType = "blob"

        request.onload = () => {
            let image = request.response
            var url = URL.createObjectURL(image)
            this.photoURL = url
        }

        request.send(params)
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

        const photo = document.createElement("img")
        photo.setAttribute("src", this.photoURL)
        photo.setAttribute("class", "galleryThumbnail")

        div.appendChild(title)
        div.appendChild(photo)
        return div
    }




}
export {
    Gallery
}
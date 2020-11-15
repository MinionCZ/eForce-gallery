import {
    Gallery
} from "./gallery.js"

const singleton = Symbol()
const singletonEnforcer = Symbol()
class GalleryStore {
    static galleries = []

    static addGallery(gallery) {
        this.galleries.push(gallery)
    }
    static getAllGalleries() {
        return this.galleries
    }
    static sortGalleries(sortBy = "title", ascending = true) {


        var compareByName = function (a, b) {
            if (a.title < b.title) {
                return -1
            } else if (a.title > b.title) {
                return 1
            }
            return 0
        }

        var compareByEventDate = function (a, b) {
            if (a.eventDate < b.eventDate) {
                return -1
            } else if (a.eventDate > b.eventDate) {
                return 1
            }
            return 0
        }
        var compareByContributionDate = function (a, b) {
            if (a.contributionDate < b.contributionDate) {
                return -1
            } else if (a.contributionDate > b.contributionDate) {
                return 1
            }
            return 0
        }

        switch (sortBy) {
            case "title":
                this.galleries.sort(compareByName)
                break

            case "eventDate":
                this.galleries.sort(compareByEventDate)
                break

            case "contributionDate":
                this.galleries.sort(compareByContributionDate)
                break

        }

    }

    static findGalleries(stringToFind = "") {
        let foundGalleries = []
        for (const gallery in this.galleries) {
            const highlight = gallery.searchForHighlightedWords(stringToFind)
            if (highlight.isHighlighted) {
                foundGalleries.push(gallery)
            }
        }
        return foundGalleries
    }

    static getAllGalleries() {
        return this.galleries
    }

    static renderGalleries(galleriesToRender) {
        for (const gallery of galleriesToRender) {
            document.body.appendChild(gallery.renderDiv())
        }
    }

}




export {
    GalleryStore
}
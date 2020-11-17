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
            let aEvent = GalleryStore.dateToNumber(a.eventDate)
            let bEvent = GalleryStore.dateToNumber(b.eventDate)
            if (aEvent < bEvent) {
                return -1
            } else if (aEvent > bEvent) {
                return 1
            }
            return 0
        }
        var compareByContributionDate = function (a, b) {
            let aDate = GalleryStore.dateToNumber(a.contributionDate)
            let bDate = GalleryStore.dateToNumber(b.contributionDate)
            if (aDate < bDate) {
                return -1
            } else if (aDate > bDate) {
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
        if (!ascending){
            this.galleries.reverse()
        }
    }

    static dateToNumber(date){
        let splitted = date.split(".")
        let year = parseInt(splitted[2]) * 10000
        let month = parseInt(splitted[1]) * 100
        let day = parseInt(splitted[0])
        return year + month + day
    }

    static findGalleries(stringToFind = "") {
        let foundGalleries = []
        for (const gallery of this.galleries) {
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
}




export {
    GalleryStore
}
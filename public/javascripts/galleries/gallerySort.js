import {
    fromPairs
} from "lodash"
import {
    GalleryStore
} from "./galleryStore.js"

import {
    Gallery
} from "./gallery.js"
class GallerySort {
    static sortedGalleries = []
    static tagMap = []
    static clickedTags = []
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
                this.sortedGalleries.sort(compareByName)
                break
            case "eventDate":
                this.sortedGalleries.sort(compareByEventDate)
                break
            case "contributionDate":
                this.sortedGalleries.sort(compareByContributionDate)
                break
        }
        if (!ascending) {
            this.sortedGalleries.reverse()
        }
    }
    static findGalleries(stringToFind = "") {
        let galleries = GalleryStore.getAllGalleries()
        let foundGalleries = []
        for (const gallery of galleries) {
            const highlight = gallery.searchForHighlightedWords(stringToFind)
            if (highlight.isHighlighted) {
                foundGalleries.push(gallery)
            }
        }
        return foundGalleries
    }

    static getSortedGalleries() {
        return this.sortedGalleries
    }

    static handleClickedTag(tag) {
        this.clickedTags.push(tag)
    }
    static handleTagCancel(tag) {
        let helpTags = []
        for (const t of this.clickedTags) {
            if (t !== tag) {
                helpTags.push(t)
            }
        }
        this.clickedTags = helpTags
    }

    static handleQueryChange() {
        const queryInfo = this.getQueryInfo()



    }
    static getQueryInfo() {
        let search = document.getElementById("searchBar").value
        let asc = document.getElementById("sortAscDesc").value
        let mainSort = document.getElementById("mainSort").value
        let logicFunction = document.getElementById("tagsOrAnd").value
        let ascending = true
        if (asc === "desc") {
            ascending = false
        }

        return {
            search: search,
            ascending: ascending,
            mainSort: mainSort,
            logicFunction: logicFunction

        }

    }

    static findGalleriesByTag(tag = "") {
        if (tag === "") {
            return GalleryStore.getAllGalleries()
        }
        if (this.tagMap.size === 0) {
            this.tagMap = GalleryStore.getTaggedMap()
        }
        return this.tagMap.get(tag)
    }

    static getAllTaggedGalleries(logicFunction) {

        if (this.clickedTags.length === 0) {
            return this.findGalleriesByTag()
        } else if (this.clickedTags.length === 1) {
            return this.findGalleriesByTag(this.clickedTags[0])
        }

        let galleries = []  
        if (logicFunction === "and") {
            galleries = this.handleMapWithAndOperator()
        } else {

        }

    }

//troll coment
    static handleMapWithAndOperator() {
        let occurrenceMap = new Map()
        for (let tag of this.clickedTags) {
            let allGalleriesForTag = this.findGalleriesByTags(tag)
            for (const gallery of allGalleriesForTag) {
                if (occurrenceMap.has(gallery.title)) {
                    let galleryFromMap = occurrenceMap.get(gallery.title)
                    galleryFromMap.value += 1
                    occurrenceMap.set(gallery.title, galleryFromMap)
                } else {
                    occurrenceMap.set(gallery.title, {
                        gallery: gallery,
                        value: 1
                    })
                }
            }
        }
        let finalArray = []
        for (let occurrence of occurrenceMap.keys()){
            if(occurrence.value >= 2){
                finalArray.push(occurrence.gallery)
            }
        }
        return finalArray
    }
}


export {
    GallerySort
}
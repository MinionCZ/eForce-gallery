import {
    GalleryRender
} from "./galleryRender.js"
import {
    GalleryStore
} from "./galleryStore.js"

import {
    Gallery
} from "./gallery.js"
class GallerySort {
    static sortedGalleries = []
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
    static findGalleries(stringToFind = "", galleries) {
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

    static toggleTag(tag){
        if(this.clickedTags.includes(tag)){
            this.popClickedTag(tag)
            return false
        }else{
            this.addClickedTag(tag)
            return true
        }
    }

    static addClickedTag(tag) {
        this.clickedTags.push(tag)
        GalleryStore.getColorForTag(tag)
    }
    static popClickedTag(tag) {
        let helpTags = []
        for (const t of this.clickedTags) {
            if (t !== tag) {
                helpTags.push(t)
            }
        }
        this.clickedTags = helpTags
        GalleryStore.freeTagColor(tag)
    }


    static getQueryInfo() {
        let search = document.getElementById("searchBar").value
        let asc = document.getElementById("sortAscDesc").value
        let mainSort = document.getElementById("mainSort").value
        let ascending = true
        if (asc === "desc") {
            ascending = false
        }

        return {
            search: search,
            ascending: ascending,
            mainSort: mainSort
        }

    }

    static findGalleriesByTag(tag = "") {
        if (tag === "") {
            return GalleryStore.getAllGalleries()
        }
        return GalleryStore.getTaggedMap().get(tag)
    }

    static getAllTaggedGalleries() {

        if (this.clickedTags.length === 0) {
            return this.findGalleriesByTag()
        } else if (this.clickedTags.length === 1) {
            return this.findGalleriesByTag(this.clickedTags[0])
        }
        return this.filterGalleriesByMultipleTags()
    }

    static filterGalleriesByMultipleTags() {
        console.log(this.clickedTags)
        let galleries = this.findGalleriesByTag(this.clickedTags[0])
        console.log(galleries, typeof galleries, galleries.length)
        for (let i = 1; i < this.clickedTags.length; i++){
            let helpArr = []
            for (let gallery of galleries){
                if (gallery.hasTag(this.clickedTags[i])){
                    helpArr.push(gallery)
                }
            }
            galleries = helpArr
        }
        return galleries
    }


    static handleQueryChange() {
        const queryInfo = this.getQueryInfo()
        this.sortedGalleries = GalleryStore.getAllGalleries()
        this.sortedGalleries = this.getAllTaggedGalleries()
        this.sortedGalleries = this.findGalleries(queryInfo.search, this.sortedGalleries)
        this.sortGalleries(queryInfo.mainSort, queryInfo.ascending)
        GalleryRender.renderGalleries(this.sortedGalleries, queryInfo.search)
    }

    static getClickedTags(){
        return this.clickedTags
    }

    static getSortedGalleries(galleries){
        this.sortedGalleries = galleries
        this.sortGalleries()
        return this.sortedGalleries
    }
}

export {
    GallerySort
}
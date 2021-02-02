import {
    GalleryStore
} from "./galleryStore.js"

import {
    createPopupWindow
} from "../photos/layoutGenerator.js"

import{
    buildMainLayout
}from "./mainPageGenerator.js"

/*
submits gallery to backend to update information
*/
async function submitGallery() {
    const response = await fetch("/eforce-gallery/gallery-manager/update-gallery", {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(GalleryStore.getGallery())
    })
    changeUrl(GalleryStore.getGallery().title)
    await buildMainLayout()

    createPopupWindow((await response.json()).message)

}

/*
checks if data are correct, and then submits
*/

function submitNewGalleryData() {
    if (checkDataCorrection()) {
        submitGallery()
    }
}

/*
checks if something changed and data are correct
*/
function checkDataCorrection() {
    if (checkTitleCorrection() && checkDateCorrection()) {
        filterTags()
        return checkIfSomethingChanged()
    }
    return false

}

/*
checks if title is not used and it is not empty
*/
function checkTitleCorrection() {
    const title = GalleryStore.getGallery().title
    if (title.length === 0) {
        createPopupWindow("Gallery title cannot be empty")
        return false
    }
    if (title === GalleryStore.getOldGallery().title) {
        return true
    }
    for (const galTitle of GalleryStore.getGalTitles()) {
        if (galTitle === title) {
            createPopupWindow("This gallery name is already used")
            return false
        }
    }
    return true
}
/*
checks date correction
*/
function checkDateCorrection() {
    const date = GalleryStore.getGallery().eventDate
    const numbers = new Set("0123456789-".split(""))
    for (const char of date.split("")) {
        if (!numbers.has(char)) {
            createPopupWindow("Date is in incorrect format, please use date selector")
            return false
        }
    }
    return true
}
/*
filter tags, removing incidents and empty tags
*/
function filterTags() {
    const filteredTags = []
    const usedTags = new Set()
    for (const tag of GalleryStore.getGallery().tags) {
        if (tag.length > 0 && !usedTags.has(tag)) {
            filteredTags.push(tag)
            usedTags.add(tag)
        }
    }
    GalleryStore.getGallery().tags = filteredTags
}
/*
checks if something changed 
*/
function checkIfSomethingChanged() {
    const oldGal = GalleryStore.getOldGallery()
    const newGal = GalleryStore.getGallery()
    const changed = !(JSON.stringify(oldGal) === JSON.stringify(newGal))
    console.log(oldGal, newGal)
    if (!changed) {
        createPopupWindow("There is nothing to submit")
    }
    return changed
}

/*
changes url to new title of gallery
*/
function changeUrl(title){
    const url = new URL(window.location.href)
    url.searchParams.set("gallery-title", title)
    window.history.replaceState({}, null, url);
}

export {
    submitNewGalleryData,
    changeUrl
}
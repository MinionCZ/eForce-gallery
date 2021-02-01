import {
    GalleryStore
} from "./galleryStore.js"

import {
    createPopupWindow
} from "../photos/layoutGenerator.js"

import{
    setNewGallery,
    buildMainLayout
}from "./mainPageGenerator.js"
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


function submitNewGalleryData() {
    if (checkDataCorrection()) {
        submitGallery()
    }
}

function checkDataCorrection() {
    if (checkTitleCorrection() && checkDateCorrection()) {
        filterTags()
        return checkIfSomethingChanged()
    }
    return false

}

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

function changeUrl(title){
    const url = new URL(window.location.href)
    url.searchParams.set("gallery-title", title)
    window.history.replaceState({}, null, url);
}

export {
    submitNewGalleryData
}
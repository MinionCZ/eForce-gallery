import {
    fetchAllGalleries,
    fetchGalleryByTitle
} from "./galleryFetcher.js"
import {
    createPopupWindow
} from "../photos/layoutGenerator.js"

import {
    GalleryStore
}from "./galleryStore.js"
/*
builds main page of gallery manager, one without photos
*/
async function buildMainLayout(isGallerySelected) {
    const root = document.createElement("div")
    document.body.appendChild(root)
    const galTitles = await fetchAllGalleries()
    if (isGalleryInURL(galTitles)) {
        const galleryTitle = getGalleryFromURL()
        GalleryStore.buildNewGallery(await fetchGalleryByTitle(galleryTitle))
        root.appendChild(buildGalleryChooser(galTitles, true, galleryTitle))
    } else {
        root.appendChild(buildGalleryChooser(galTitles, false))
    }
}

/*
creates selector for galleries if gallery is not choosen
*/
function buildGalleryChooser(galTitles, isSelected, selectedGallery = "") {
    const div = document.createElement("div")
    const selector = document.createElement("input")
    selector.setAttribute("class", "text")
    selector.setAttribute("list", "galleryNames")
    const dataList = document.createElement("datalist")
    dataList.setAttribute("id", "galleryNames")
    let buffer = ""
    for (const title of galTitles) {
        buffer += "<option>" + title + "</option>"
    }
    dataList.innerHTML = buffer
    const submitBtn = document.createElement("button")
    submitBtn.textContent = "Submit"
    div.appendChild(selector)
    div.appendChild(dataList)
    div.appendChild(submitBtn)
    selector.addEventListener("keyup", (event) => {
        if (event.key === "Enter") {
            if (isStringInArray(selector.value, galTitles)) {
                setNewGallery(selector.value)
            } else {
                if (selector.value.length > 0) {
                    createPopupWindow("Gallery with title \"" + selector.value + "\" does not exists")
                } else {
                    createPopupWindow("Please fill in gallery title or choose from list")
                }
            }
        }
    })

    submitBtn.onclick = () =>{
        if(isStringInArray(selector.value, galTitles)){
            setNewGallery(selector.value)
        }else{
            if (selector.value.length > 0) {
                createPopupWindow("Gallery with title \"" + selector.value + "\" does not exists")
            } else {
                createPopupWindow("Please fill in gallery title or choose from list")
            }
        }
    }

    if (isSelected) {
        selector.setAttribute("class", "selected gallery-fetcher-roll")
        submitBtn.setAttribute("class", "selected submit-button")
        div.setAttribute("class", "selected gallery-fetcher-div")
        selector.value = selectedGallery
    } else {
        selector.setAttribute("class", "gallery-fetcher-roll")
        submitBtn.setAttribute("class", "submit-button")
        div.setAttribute("class", "gallery-fetcher-div")
    }
    return div
}
/*
checks if gallery is in array and if url is not corrupted or empty
*/
function isGalleryInURL(galTitles) {
    const url = new URL(window.location.href)
    const param = url.searchParams.get("gallery-title")
    if (param === null) {
        return false
    }
    return isStringInArray(param, galTitles)
}

/*
returns logic value if is string in array
*/
function isStringInArray(string, array) {
    for (const s of array) {
        if (s === string) {
            return true
        }
    }
    return false
}

async function setNewGallery(title) {
    const url = new URL(window.location.href)
    url.searchParams.set("gallery-title", title)
    window.location.href = url
}

function getGalleryFromURL(){
    const url = new URL(window.location.href)
    return url.searchParams.get("gallery-title")
}

window.onload = () => {
    buildMainLayout(false)
}
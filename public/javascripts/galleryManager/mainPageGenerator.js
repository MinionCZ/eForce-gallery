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
import {
    generateTopSwitchLayout
} from "./topSwitchLayout.js"

import{
    generateTagsLayout
}from "./tagsGenerator.js"

/*
builds main page of gallery manager, one without photos
*/
async function buildMainLayout() {
    const galTitles = await fetchAllGalleries()
    if (isGalleryInURL(galTitles)) {
        const galleryTitle = getGalleryFromURL()
        GalleryStore.buildNewGallery(await fetchGalleryByTitle(galleryTitle))
        GalleryStore.setGalTitles(galTitles)
        buildMainPage()
    } else {
        document.body.appendChild(buildGalleryChooser(galTitles, false))
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

function buildMainPage(){
    GalleryStore.clearRoot()
    const root = GalleryStore.getRoot()
    root.appendChild(generateTopSwitchLayout())
    root.appendChild(buildGalleryChooser(GalleryStore.getGalTitles(), true, GalleryStore.getGallery().title))
    root.appendChild(buildBasicInformationTable())
    generateTagsLayout()
}


function buildBasicInformationTable(){
    const gallery = GalleryStore.getGallery()
    const infoTableDiv = document.createElement("div")
    infoTableDiv.setAttribute("class", "info-table-div")
    const title = document.createElement("h1")
    title.innerText = "Gallery overview"
    title.setAttribute("class", "table-title")
    infoTableDiv.appendChild(title)


    const firstRow = document.createElement("div")
    firstRow.setAttribute("class", "input-row")
    firstRow.appendChild(buildTableRow("Title: ", gallery.title, true))
    firstRow.appendChild(buildTableRow("Event date: ", gallery.eventDate, true, "date"))
    firstRow.appendChild(buildTableRow("Contributor: ", gallery.contributor, false))

    const secondRow = document.createElement("div")
    secondRow.setAttribute("class", "input-row")

    
    secondRow.appendChild(buildTableRow("Number of photos: ", gallery.photos.length, false))
    secondRow.appendChild(buildTableRow("Contribution date: ", gallery.contributionDate ,false, "date"))
    secondRow.appendChild(buildTableRow("Gallery size: ", gallery.fullSize, false))
    infoTableDiv.appendChild(firstRow)
    infoTableDiv.appendChild(secondRow)
    infoTableDiv.appendChild(buildLabelLayout())
    return infoTableDiv
}

function buildTableRow(title, value, changable, type = "text"){
    const div = document.createElement("div")
    div.setAttribute("class", "stats-div")
    const label = document.createElement("label")
    label.setAttribute("for", title)
    label.innerText = title
    const input = document.createElement("input")
    input.setAttribute("id", title)
    input.type = type
    if(changable){
        input.setAttribute("class", "gallery-input changable")
    }else{
        input.setAttribute("class", "gallery-input")
    }

    input.readOnly = !changable
    input.value = value
    div.appendChild(label)
    div.appendChild(document.createElement("br"))
    div.appendChild(input)
    return div
}

function buildLabelLayout(){
    const gallery = GalleryStore.getGallery()
    const div = document.createElement("div")
    div.setAttribute("class","gallery-label-div")
    const title = document.createElement("h4")
    title.setAttribute("class", "gallery-label-title")
    title.innerText = "Gallery label:"
    const label = document.createElement("textarea")
    label.innerText = gallery.label
    label.setAttribute("class", "gallery-label")
    div.appendChild(title)
    div.appendChild(label)
    return div
}

window.onload = () => {
    buildMainLayout()
}
export{
    buildMainPage
}

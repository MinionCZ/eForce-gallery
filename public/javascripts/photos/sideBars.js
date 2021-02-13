import { fetchAllGalleries, fetchAllTags } from "../galleryManager/galleryFetcher.js"
import { createPopupWindow } from "./layoutGenerator.js"
import { PhotosStore } from "./photosStore.js"
import { SideBarsStore } from "./sideBarsStore.js"

const usedTags = new Set()
const usedGalleries = new Set()
const gallerySelects = []
const tagsSelects = []
let galleryId = 0
let tagsId = 0
function toggleSideBar(event) {
    const value = event.target.value

    let toggle = false
    let size = "0px"
    toggle = !PhotosStore.getToggleState(value)
    if (toggle) {
        size = "16.66%"
    }
    document.getElementById(value).style.width = size
    PhotosStore.setToggleState(toggle, value)
    PhotosStore.renderPhotos()
}
async function handleAddGalleryOrTag(event) {
    if (event.target.id === "addTagsButton") {
        addTagLayout()
    } else {
        addGalleryLayout()
    }
}
async function addTagLayout() {
    const tags = await fetchAllTags()
    if (tags.length !== usedTags.size) {
        document.getElementById("tagsDataDiv").appendChild(createQueryLayout("tags", tags))
    }
    if (tags.length === usedTags.size) {
        document.getElementById("addTagsButton").disabled = true
        createPopupWindow("There are no more tags in use")
    }
    if (usedTags.size === 15) {
        document.getElementById("addTagsButton").disabled = true
        createPopupWindow("Only 15 tags can be choosed")
    }
    render("tags")
}

async function addGalleryLayout() {
    const galleries = await fetchAllGalleries()
    if (galleries.length !== usedGalleries.size) {
        document.getElementById("galleryDataDiv").appendChild(createQueryLayout("gallery", galleries))
    }
    if (galleries.length === usedGalleries.size) {
        document.getElementById("addGalleryButton").disabled = true
        createPopupWindow("There are no more galleries in use")
    }
    if (usedGalleries.size === 15) {
        document.getElementById("addGalleryButton").disabled = true
        createPopupWindow("Only 15 galeries can be choosed")
    }

    render("gallery")
}

function createQueryLayout(type, list) {
    const layout = document.createElement("div")
    layout.className = "query-data-div"
    layout.appendChild(createSelect(type, getUnusedItems(list, type)))
    if (type === "gallery") {
        layout.id = "layout-" + type + "-" + galleryId
        layout.appendChild(createDeleteButton(type, galleryId))
        galleryId++
    } else {
        layout.appendChild(createDeleteButton(type, tagsId))
        layout.id = "layout-" + type + "-" + tagsId
        tagsId++
    }
    return layout
}


function createSelect(type, list) {
    const select = document.createElement("select")
    select.className = "query-select " + type
    for (const item of list) {
        const option = document.createElement("option")
        option.text = item
        select.appendChild(option)
    }
    select.onchange = () => {
        handleChangeOfSelection(type, select.value)
    }
    const dataSelect = {
        select: select,
        lastValue: list[0]
    }
    if (list.length > 0) {
        if (type === "gallery") {
            usedGalleries.add(list[0])
            gallerySelects.push(dataSelect)
        } else {
            usedTags.add(list[0])
            tagsSelects.push(dataSelect)
        }
    }
    select.selectedIndex = 0
    return select
}
function createDeleteButton(type, id) {
    const exitButton = document.createElement("button")
    exitButton.className = "query-delete-button"
    exitButton.id = type + "-" + id
    exitButton.innerText = "\u2715"
    exitButton.onclick = () => {
        const divToRemove = document.getElementById("layout-" + type + "-" + id)
        let rootDiv = null
        if (type === "gallery") {
            rootDiv = document.getElementById("galleryDataDiv")
            usedGalleries.delete(divToRemove.childNodes[0].value)
            document.getElementById("addGalleryButton").disabled = false
            gallerySelects.splice(getIndexOfSelect(divToRemove.childNodes[0].value, type), 1)
        } else {
            rootDiv = document.getElementById("tagsDataDiv")
            usedTags.delete(divToRemove.childNodes[0].value)
            document.getElementById("addTagsButton").disabled = false
            tagsSelects.splice(getIndexOfSelect(divToRemove.childNodes[0].value, type), 1)
        }
        rootDiv.removeChild(divToRemove)
    }
    return exitButton
}
function getUnusedItems(list, type) {
    const newList = []
    for (const item of list) {
        if (type === "gallery") {
            if (!usedGalleries.has(item)) {
                newList.push(item)
            }
        } else {
            if (!usedTags.has(item)) {
                newList.push(item)
            }
        }
    }
    return newList
}

async function render(type) {
    if (type === "gallery") {
        const list = await fetchAllGalleries()
        for (const dataSelect of gallerySelects) {
            setNewOptionsForSelect(dataSelect.select, "gallery", list)
        }
    } else {
        const list = await fetchAllTags()
        for (const dataSelect of tagsSelects) {
            setNewOptionsForSelect(dataSelect.select, "tags", list)
        }
    }
}
function setNewOptionsForSelect(select, type, list) {
    const newOptions = getUnusedItems(list, type)
    newOptions.push(select.value)
    select.options.length = 0
    for (const text of newOptions) {
        const option = document.createElement("option")
        option.text = text
        select.appendChild(option)
    }
    select.selectedIndex = newOptions.length - 1
}

function getIndexOfSelect(value, type) {
    let list = []
    if (type === "gallery") {
        list = gallerySelects
    } else {
        list = tagsSelects
    }
    let index = 0
    for (const item of list) {
        if (item.select.value === value) {
            return index
        }
        index++
    }

}
function handleChangeOfSelection(type, value) {
    const index = getIndexOfSelect(value, type)
    if (type === "gallery") {
        usedGalleries.delete(gallerySelects[index].lastValue)
        usedGalleries.add(value)
        gallerySelects[index].lastValue = value
    } else {
        usedTags.delete(tagsSelects[index].lastValue)
        usedTags.add(value)
        tagsSelects[index].lastValue = value
    }
    render(type)
}


function initLogicButtonHandlers() {
    document.getElementById("andButtonGallery").onclick = () => {
        if (SideBarsStore.getState("gallery") === "and") {
            return
        }
        document.getElementById("andButtonGallery").className = "logic-button and-button logic-selected"
        document.getElementById("orButtonGallery").className = "logic-button or-button"
        SideBarsStore.setState("gallery", "and")
        createPopupWindow("Galleries logic set to AND")
    }
    document.getElementById("orButtonGallery").onclick = () => {
        if (SideBarsStore.getState("gallery") === "or") {
            return
        }
        document.getElementById("andButtonGallery").className = "logic-button and-button"
        document.getElementById("orButtonGallery").className = "logic-button or-button logic-selected"
        SideBarsStore.setState("gallery", "or")
        createPopupWindow("Galleries logic set to OR")
    }
    document.getElementById("andButtonTags").onclick = () => {
        if (SideBarsStore.getState("tags") === "and") {
            return
        }
        document.getElementById("andButtonTags").className = "logic-button and-button logic-selected"
        document.getElementById("orButtonTags").className = "logic-button or-button"
        SideBarsStore.setState("tags", "and")
        createPopupWindow("Tags logic set to AND")
    }
    document.getElementById("orButtonTags").onclick = () => {
        if (SideBarsStore.getState("tags") === "or") {
            return
        }
        document.getElementById("andButtonTags").className = "logic-button and-button"
        document.getElementById("orButtonTags").className = "logic-button or-button logic-selected"
        SideBarsStore.setState("tags", "or")
        createPopupWindow("Tags logic set to OR")
    }
}

export { toggleSideBar, handleAddGalleryOrTag, initLogicButtonHandlers }
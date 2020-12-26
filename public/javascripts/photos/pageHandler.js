import {
    PhotosStore
} from "./photosStore.js"
import{
    isPageSelected
}from "./topSelectorHandler.js"


let page = 1
let maxPage = 1

/*
sets max page from photos counted
*/

function setMaxPage(photos) {
    let pages = Math.floor(photos / 60)
    if (photos % 60 !== 0) {
        pages++
    }
    maxPage = pages
    handleUIChange()
}
/*
return max page
*/

function getMaxPage() {
    return maxPage
}
/*
increments page after button click
*/

function incrementHandler() {
    if (page < maxPage) {
        page++
        PhotosStore.fetchPage(page)
        handleUIChange()
    }
}

/*
decrement page after button click
*/
function decrementHandler() {
    if (page > 1) {
        page--
        PhotosStore.fetchPage(page)
        handleUIChange()
    }
}
/*
handles ui change, sets buttons disabled, changes page etc
*/

function handleUIChange() {
    let decrementButton = document.getElementById("decrementPageButton")
    let incrementButton = document.getElementById("incrementPageButton")
    decrementButton.disabled = page === 1
    incrementButton.disabled = page === maxPage
    document.getElementById("pageInput").value = page
    document.getElementById("maxPages").textContent = "/" + maxPage
    document.getElementById("selectAllPhotosOnPage").textContent = isPageSelected(page) ? "Deselect all on page" : "Select all on page"
}

/*
handles page insert into page input, checks valid chars and length
 */
function handleWritePage(event) {
    let keyPressed = event.key
    const pageInput = document.getElementById("pageInput")
    let allOk = true
    let isLetterCorrect = isCorrectLetter(keyPressed)
    if (!isLetterCorrect.valid) {
        event.preventDefault()
        allOk = false
    } else {
        if (!isLengthOk(isLetterCorrect, pageInput)) {
            event.preventDefault()
            allOk = false
        }
        if (!isPageOk(pageInput.value, keyPressed, isLetterCorrect)){
            event.preventDefault()
            allOk = false
        }
    }
    if (allOk && keyPressed === "Enter"){
        event.preventDefault()
        getSelectedPage(pageInput)
    }
}

/*
checks all possible keys, that can be inserted, numbers + Backspace
*/

function isCorrectLetter(letter) {
    const keys = new Set(["Backspace", "Enter"])
    for (let i = 0; i < 10; i++) {
        keys.add("" + i)
    }
    let isNumber = letter.length === 1
    let isValid = keys.has(letter)
    return {
        valid: isValid,
        number: isNumber
    }
}

/*
returns if length is shorter than 3 characters
*/

function isLengthOk(isLetterCorrect, pageInput) {
    let length = pageInput.value.length
    if (length === 3 && !isLetterCorrect.number) {
        return false
    }
    return true
}

/*
returns data if the page inserted by user is smaller than max page
*/

function isPageOk(pageInInput, key, isLetterCorrect){
    if (!isLetterCorrect.number){
        return true
    }else{
        let finalPage = parseInt(pageInInput + key)
        return finalPage <= maxPage && finalPage >= 1
    }

}

/*
renders new page from backend
*/

function getSelectedPage(pageInInput){
    if (pageInInput.value.length === 0){
        alert("Please select valid page")
    }else{
        let newPage = parseInt(pageInInput.value)
        page = newPage
        handleUIChange()
        PhotosStore.fetchPage(page)
    }
}

function getPage(){
    return page
}



export {
    getMaxPage,
    incrementHandler,
    decrementHandler,
    setMaxPage,
    handleWritePage,
    getPage
}
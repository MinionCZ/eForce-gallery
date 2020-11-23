const galleries = []
import {
    Gallery
} from "./gallery.js"
import {
    GalleryStore
} from "./galleryStore.js"

import {
    GalleryRender
} from "./galleryRender.js"

import {
    GallerySort
}from "./gallerySort.js"


function createLayout(galleries) {
    console.log(galleries)
    fetchGalleriesInfo()
}

function fetchGalleriesInfo() {
    GalleryStore.fetchTagColors()
    var request = new XMLHttpRequest()
    request.addEventListener("load", handleGalleryInformation)
    request.open("GET", "/galleries/get-all")
    request.send()

}

fetchGalleriesInfo()


function handleGalleryInformation() {

    let galleriesInfo = JSON.parse(this.responseText)
    for (const gal of galleriesInfo) {
        GalleryStore.addGallery(new Gallery(gal))
    }
    GallerySort.handleQueryChange()
}

function handleSortAndSearch() {
    GallerySort.handleQueryChange()
}
function handleQueryCancel(){
    GallerySort.cancelQuery()
}

window.onload = () => {
    document.getElementById("mainSort").addEventListener("change", handleSortAndSearch)
    document.getElementById("sortAscDesc").addEventListener("change", handleSortAndSearch)
    document.getElementById("searchBar").addEventListener("input", handleSortAndSearch)
    document.getElementById("cancelQueryButton").addEventListener("click", handleQueryCancel)
}
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

function createLayout(galleries) {
    console.log(galleries)
    fetchGalleriesInfo()
}

function fetchGalleriesInfo() {
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
    GalleryStore.sortGalleries()
    GalleryRender.renderGalleries(GalleryStore.getAllGalleries())

}

function handleSortAndSearch() {
    let mainSort = document.getElementById("mainSort").value
    let secondSort = document.getElementById("sortAscDesc").value
    let asc = true
    if (secondSort === "desc") {
        asc = false
    }
    GalleryStore.sortGalleries(mainSort, asc)
    let sortString = document.getElementById("searchBar").value
    if (sortString === "") {
        GalleryRender.renderGalleries(GalleryStore.getAllGalleries())
    } else {
        let foundGalleries = GalleryStore.findGalleries(sortString)
        GalleryRender.renderGalleries(foundGalleries)
    }

}




window.onload = () => {
    document.getElementById("mainSort").addEventListener("change", handleSortAndSearch)
    document.getElementById("sortAscDesc").addEventListener("change", handleSortAndSearch)
    document.getElementById("searchBar").addEventListener("input", handleSortAndSearch)
}
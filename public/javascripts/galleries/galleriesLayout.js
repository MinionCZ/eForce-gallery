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
    GalleryRender.renderGalleries(GalleryStore.getAllGalleries())

}
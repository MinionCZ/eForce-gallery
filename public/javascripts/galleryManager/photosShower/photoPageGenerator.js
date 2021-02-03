import{
    generateTopSwitchLayout
}from "../topSwitchLayout.js"

import{
    GalleryStore
}from "../galleryStore.js"
const root = GalleryStore.getRoot()
function buildPhotosLayout(){
    root.appendChild(generateTopSwitchLayout())
    console.log("hola hej")
}
export{
    buildPhotosLayout
}
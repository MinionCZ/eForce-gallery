import {PhotosStore} from "./photosStore.js"
import {CheckStore} from "./checkStore.js"
function setMaxPage(photos){
    let pages = Math.floor(photos/60)
    if(photos%60 > 0){
        pages++
    }
    document.getElementById("maxPages").innerHTML= "/" + pages
}

function selectAllOnPage(){
    for (const photo of PhotosStore.photos){
        CheckStore.addCheckedPhoto(photo.fileName)
        photo.checkBox.checked = true
    }
}




function initTopSelector(){
    document.getElementById("selectAllPhotosOnPage").addEventListener("click", selectAllOnPage)
}


export{
    setMaxPage,
    initTopSelector
}
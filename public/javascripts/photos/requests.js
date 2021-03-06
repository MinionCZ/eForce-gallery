import {createPopupWindow} from "./layoutGenerator.js"
import {PhotosStore} from "./photosStore.js"

/*
sends request to download selected photos from backend
*/
async function downloadSelectedPhotos(selectedPhotos, allPhotos, version, tags) {
    const data = {
        photos: cropPhotos(selectedPhotos),
        allPhotos: allPhotos,
        version: version,
        tags: tags
    }

    const response = await fetch("/eforce-gallery/download/generate-token-for-download", {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    const respondedData = await response.json()
    const a = document.createElement("a")
    a.href = window.location.origin + "/eforce-gallery/download/photos?downloadToken=" + respondedData.downloadToken
    a.click()
}

/*
crops additional data from photo object, saves only file name which is mandatory for download
*/
function cropPhotos(photos){
    const croppedPhotos = []
    for (const photo of photos){
        if(typeof(photo) === "string"){
            croppedPhotos.push(photo)
        }else{
            croppedPhotos.push(photo.fileName)
        }
    }
    return croppedPhotos
}


/*
sends request to the backend and waits for response, delete photos
*/
async function deleteSelected(selectedPhotos, allPhotos){
    const data = {
        photos: cropPhotos(selectedPhotos),
        allPhotos: allPhotos
    }
    const response = await fetch("/eforce-gallery/photos/delete", {
        method:"POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    createPopupWindow((await response.json()).deleted)
    PhotosStore.fetchPage(1)
}

/*
sends request to backend for adding photos to gallery
*/
async function linkPhotosToDatabase(photosToLink, allSelected, galleryTitle){
    const data = {
        photos: photosToLink,
        allSelected: allSelected,
        galleryTitle: galleryTitle
    }

    const response = await fetch("/eforce-gallery/photos/link-photos-to-gallery",{
        method:"POST",
        headers:{
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    createPopupWindow((await response.json()).status)
}





export {
    downloadSelectedPhotos,
    deleteSelected,
    linkPhotosToDatabase
}
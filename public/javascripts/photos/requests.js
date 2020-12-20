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

    const response = await fetch("/download/generate-token-for-download", {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    const respondedData = await response.json()
    const a = document.createElement("a")
    a.href = window.location.origin + "/download/photos?downloadToken=" + respondedData.downloadToken
    a.click()
}

/*
crops additional data from photo object, saves only file name which is mandatory for download
*/
function cropPhotos(photos){
    const croppedPhotos = []
    for (const photo of photos){
        croppedPhotos.push(photo.fileName)
    }
    return croppedPhotos

}

export {
    downloadSelectedPhotos
}
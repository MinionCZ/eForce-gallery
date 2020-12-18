
/*
sends request to download selected photos from backend
*/
async function downloadSelectedPhotos(selectedPhotos, allPhotos, version){
    const data = {
        photos:selectedPhotos,
        allPhotos: allPhotos,
        version: version
    }
    const response = await fetch("/download/photos",{
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body:JSON.stringify(data)
    })
}
export{
    downloadSelectedPhotos
}
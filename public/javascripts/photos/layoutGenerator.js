import{downloadSelectedPhotos} from "./requests.js"

/*
generates download buttons
*/
function generateDownloadButton(text, version, size, selectedPhotos, root){
    const downloadButton = document.createElement("button")
    if (version === "lite"){
        downloadButton.setAttribute("class", "download-selection-button right")
    }else{
        downloadButton.setAttribute("class", "download-selection-button left")
    }
    downloadButton.innerHTML = text + size
    downloadButton.onclick = () =>{
        downloadSelectedPhotos(selectedPhotos.photos, selectedPhotos.allSelected, version, [])
        document.body.removeChild(root)
    }
    return downloadButton
}
/*
builds download layout
*/

function buildDownloadLayout(selectedPhotos, size){
    const root = document.createElement("div")
    root.onclick = () =>{
        document.body.removeChild(root)
    }
    root.setAttribute("class", "root")
    const downloadDiv = document.createElement("div")
    downloadDiv.setAttribute("class", "download-div")
    const downloadLite = generateDownloadButton("Download lite version <br> Size ~ ", "lite", size.liteSize, selectedPhotos, root)
    const downloadFull = generateDownloadButton("Download full version <br> Size ~ ", "full", size.fullSize, selectedPhotos, root)

    const titleDiv = document.createElement("div")
    titleDiv.setAttribute("class", "title-download-div")
    titleDiv.innerHTML = "Choose option for download:"
    downloadDiv.appendChild(titleDiv)
    downloadDiv.appendChild(downloadFull)
    downloadDiv.appendChild(downloadLite)
    downloadDiv.appendChild(generateCancelButton(root))
    root.appendChild(downloadDiv)
    document.body.appendChild(root)
}

function generateCancelButton(root){
    const cancelButton = document.createElement("button")
    cancelButton.textContent = "\u2715"
    cancelButton.setAttribute("class", "cancel-button")
    cancelButton.onclick = () =>{
        document.body.removeChild(root)
    }
    return cancelButton
}




export{
    buildDownloadLayout
}
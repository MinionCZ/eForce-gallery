import{downloadSelectedPhotos} from "./requests.js"

function generateDownloadButton(text, version, size, selectedPhotos){
    const downloadButton = document.createElement("button")
    downloadButton.setAttribute("class", "downloadSelection")
    downloadButton.innerHTML = text + size
    downloadButton.onclick = () =>{
        downloadSelectedPhotos(selectedPhotos.photos, selectedPhotos.allSelected, version)
    }
    return downloadButton
}

function buildDownloadLayout(selectedPhotos, size){
    const root = document.createElement("div")
    root.setAttribute("class", "root")
    const downloadDiv = document.createElement("div")
    downloadDiv.setAttribute("class", "downloadDiv")
    const downloadLite = generateDownloadButton("Download lite version <br> Size ~ ", "lite", size.liteSize, selectedPhotos)
    const downloadFull = generateDownloadButton("Download full version <br> Size ~ ", "full", size.fullSize, selectedPhotos)
    const cancelButton = document.createElement("button")
    downloadDiv.appendChild(downloadFull)
    downloadDiv.appendChild(downloadLite)
    downloadDiv.appendChild(cancelButton)
    root.appendChild(downloadDiv)
    document.body.appendChild(root)
}

export{
    buildDownloadLayout
}
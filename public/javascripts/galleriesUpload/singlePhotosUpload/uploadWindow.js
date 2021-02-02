function createUploadWindow(galleryID = "") {
    const root = document.createElement("div")
    root.setAttribute("class", "uploading-window-root")
    root.setAttribute("id", "uploadingWindowRoot")
    root.appendChild(createDragAndDropArea())
    root.onclick = () =>{
        console.log("click")
    }
    document.body.appendChild(root)

}

function createDragAndDropArea() {
    const dragAndDrop = document.createElement("div")
    dragAndDrop.setAttribute("class", "upload-window-drag-and-drop-area")
    dragAndDrop.addEventListener("drag", (event) => {
        event.preventDefault()
    })
    dragAndDrop.addEventListener("dragenter", (event) => {
        event.preventDefault()
        dragAndDrop.setAttribute("class", "upload-window-drag-and-drop-area active")
    })
    dragAndDrop.addEventListener("dragleave", (event) => {
        event.preventDefault()
        dragAndDrop.setAttribute("class", "upload-window-drag-and-drop-area")
    })
    dragAndDrop.addEventListener("dragend", (event) => {
        event.preventDefault()
        dragAndDrop.setAttribute("class", "upload-window-drag-and-drop-area")
    })
    dragAndDrop.appendChild(createTitle("Drag&Drop </br> or"))
    dragAndDrop.appendChild(createFileInput())
    return dragAndDrop

}

function createTitle(text){
    const title = document.createElement("h2")
    title.innerHTML = text
    title.setAttribute("class", "upload-window-drag-and-drop-title")
    return title
}
function createFileInput(){
    const fileInput = document.createElement("input")
    fileInput.setAttribute("class", "upload-window-file-selector")
    fileInput.setAttribute("type", "file")
    fileInput.multiple = true
    return fileInput
}
export{
    createUploadWindow
}
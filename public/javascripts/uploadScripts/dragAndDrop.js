window.onload = () => {
    let dropArea = document.getElementById("dragAndDropArea")
    if (dropArea) {
        dropArea.addEventListener("drop", handleDrop, false)
        dropArea.addEventListener("dragenter", handleDragging, false)
        dropArea.addEventListener("dragleave", handleDragLeave, false)
        dropArea.addEventListener("dragover", function (event) {
            event.preventDefault()
        })
    }

    function handleDragging(event) {
        event.preventDefault()
        dropArea.style["background-color"] = "#99CCFF"
    }

    function handleDragLeave(event) {
        event.preventDefault()
        dropArea.style["background-color"] = "lightgray"
    }

    function handleDrop(event) {
        event.preventDefault()
        let dt = event.dataTransfer
        dropArea.style["background-color"] = "lightgray"
        handleDataUpload(dt.files)
    }

    /*
    button handling starts here
    */

    let fileInput = document.getElementById("buttonFiles")
    fileInput.onchange = () => {
        handleDataUpload(fileInput.files)
    }
}
window.onload = function () {
    let dropArea = document.getElementById("dragAndDropArea")

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
        let files = dt.files
        console.log(files)
    }
    if (dropArea) {
        dropArea.addEventListener("drop", handleDrop, false)
        dropArea.addEventListener("dragenter", handleDragging, false)
        dropArea.addEventListener("dragleave", handleDragLeave, false)
        dropArea.addEventListener("dragover", function (event) {
            event.preventDefault()
        })
    }
}
let id = 0
tagsArray = []

function deleteTagAndSortOthers(child) {
    if (tagsArray.length == 1) {
        return
    }
    for (let i = 0; i < tagsArray.length; i++) {
        if (tagsArray[i].id === child.id) {
            tagsArray.splice(i, 1)
        }
    }
    document.getElementById("tags").removeChild(child)
    for (let i = 0; i < tagsArray.length; i++) {
        document.getElementById(tagsArray[i].id).id = "tagDivId=" + i
        tagsArray[i].id = "tagDivId=" + i
    }
    id = tagsArray.length
    document.getElementById("tagsCounter").value = JSON.stringify(id)
}

function generateTagInput() {
    let root = document.createElement("div")
    root.id = "tagDivId=" + id
    root.className = "tag-div"
    let input = document.createElement("input")
    input.type = "text"
    input.name = "tagId=" + id
    input.className = "tag-input"
    let deleteButton = document.createElement("button")
    deleteButton.type = "button"
    deleteButton.addEventListener("click", function () {
        deleteTagAndSortOthers(root)
    })
    deleteButton.className = "delete-button"
    deleteButton.textContent = "Delete"
    root.appendChild(input)
    root.appendChild(deleteButton)
    document.getElementById("tags").appendChild(root)
    tagsArray.push(root)
    id++
    document.getElementById("tagsCounter").value = JSON.stringify(id)
}

function submitForm() {
    let tags = []
    for (let tag of tagsArray) {
        let tagValue = document.getElementById(tag.id).children[0].value
        tags.push({
            tagValue: tagValue
        })
    }
    document.getElementById("tagsValue").value = (JSON.stringify(tags))
    document.getElementById("galleryForm").submit()
}
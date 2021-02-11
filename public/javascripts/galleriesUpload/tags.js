let id = 0
const tagsArray = []
import { getDatalistWithTagsForInput } from "./dataVerifier.js"
/*
is button delete next to tag is clicked => this tag is deleted and other tags are reindexed and sorted, respecting their previous order
*/
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
        tagsArray[i].childNodes[0].id = "tagId=" + i
        tagsArray[i].childNodes[0].name = "tagId=" + i
    }
    id = tagsArray.length
    document.getElementById("tagsCounter").value = JSON.stringify(id)
    document.getElementById("tagId=" + (id - 1)).focus()
}

/*
generates new tag and add it to the body
*/
function generateTagInput() {
    let root = document.createElement("div")
    root.id = "tagDivId=" + id
    root.className = "tag-div"
    let input = document.createElement("input")
    input.type = "text"
    input.name = "tagId=" + id
    input.className = "tag-input"
    input.id = "tagId=" + id
    input.setAttribute("list", "list" + input.id)
    input.onkeydown = (event) => {
        const splits = input.id.split("=")
        checkInput(event, parseInt(splits[1]))
    }
    let deleteButton = document.createElement("button")
    deleteButton.type = "button"
    deleteButton.addEventListener("click", function () {
        deleteTagAndSortOthers(root)
    })
    deleteButton.className = "delete-button"
    deleteButton.textContent = "\u2715"
    root.appendChild(input)
    root.appendChild(deleteButton)
    root.appendChild(getDatalistWithTagsForInput(input.id))
    console.log(getDatalistWithTagsForInput(input.id))

    document.getElementById("tags").appendChild(root)
    tagsArray.push(root)
    id++
    document.getElementById("tagsCounter").value = JSON.stringify(id)
}

/*
sucks data out of tags
*/

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
function checkInput(event, thisId) {
    if (event.key === "Enter" || event.key === "Tab") {
        event.preventDefault()
        if (thisId + 1 < id) {
            document.getElementById("tagId=" + thisId).blur()
            document.getElementById("tagId=" + (thisId + 1)).focus()
        } else {
            document.getElementById("tagId=" + (id - 1)).blur()
            generateTagInput()
            document.getElementById("tagId=" + (thisId + 1)).focus()
        }
    }else if (event.key === "Delete" || event.key === "Backspace"){
        if(document.getElementById("tagId=" + thisId).value.length === 0){
            deleteTagAndSortOthers(document.getElementById("tagDivId=" + thisId))
        }
    }

}




export {
    generateTagInput,
    submitForm
}
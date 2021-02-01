import { GalleryStore } from "./galleryStore.js";
let tags = []
const tagDiv = document.createElement("div");
function generateTagsLayout() {
	tags = GalleryStore.getGallery().tags;
	if (!document.body.contains(tagDiv)) {
		document.body.appendChild(tagDiv)
	}
	tagDiv.innerHTML = "";
	tagDiv.setAttribute("class", "tag-div")
	
	const tagsTitle = document.createElement("h2")
	tagsTitle.setAttribute("class", "tags-title")
	tagsTitle.innerText = "Tags:"
	tagDiv.appendChild(tagsTitle)

	if (tags.length) {
		let counter = 0
		let lineDiv = document.createElement("div")
		for (const tag of tags) {
			if (counter % 3 === 0 && counter > 0) {
				tagDiv.appendChild(lineDiv)
				lineDiv = document.createElement("div")
			}
			lineDiv.appendChild(generateTagDiv(tag, counter))
			lineDiv.setAttribute("class", "line-tag-holder")
			counter++
		}
		if (counter > 0) {
			tagDiv.appendChild(fillLastLineDiv(counter, lineDiv))

		}
	}else{
		const errorMessage = document.createElement("h3")
		errorMessage.innerText= "This gallery has no tags"
		errorMessage.setAttribute("class", "no-tags-error")
		tagDiv.appendChild(errorMessage)
	}
	tagDiv.appendChild(generateAddingButton())
}

function generateTagDiv(tag, id) {
	const div = document.createElement("div");
	div.setAttribute("class", "tag-div-layout");
	div.setAttribute("id", "tag" + id);
	const tagInput = document.createElement("input");
	tagInput.value = tag;
	tagInput.setAttribute("type", "text")
	tagInput.setAttribute("class", "tag-input");
	const button = document.createElement("button");
	button.innerText = "\u2715";
	button.setAttribute("class", "delete-tag-button")
	button.onclick = () => {
		deleteTag(id);
		generateTagsLayout()
	}

	div.appendChild(tagInput)
	div.appendChild(button)
	return div
}

function deleteTag(id) {
	tags.splice(id, 1)

	GalleryStore.getGallery().tags = tags;
}

function generateAddingButton() {
	const div = document.createElement("div")
	div.setAttribute("class", "add-tag-button")
	const addingButton = document.createElement("button")
	addingButton.setAttribute("class", "adding-button")
	addingButton.innerText = "Add tag"
	addingButton.onclick = () => {
		tags.push("")
		GalleryStore.getGallery().tags = tags
		generateTagsLayout()
	}

	div.appendChild(addingButton)
	return div
}

function fillLastLineDiv(counter, lineDiv){
	for(;counter % 3 !== 0; counter++){
		const div = document.createElement("div")
		div.setAttribute("class", "tag-div-layout")
		lineDiv.appendChild(div)
	}
	return lineDiv
}

export {
	generateTagsLayout
}
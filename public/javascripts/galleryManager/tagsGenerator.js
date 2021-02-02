import { GalleryStore } from "./galleryStore.js";
let tags = []
const tagDiv = document.createElement("div");


/*
creates tag list for tag inputs
*/
function getTagList(listID){
	const taglist = document.createElement("datalist")
	taglist.setAttribute("id", listID)
	for(const tag of GalleryStore.getTags()){
		taglist.innerHTML += "<option>" + tag + "</option>"
	}
	return taglist
}

/*
generates tag layout and divides tags into lines 
*/
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

/*
generates div with input and button for tag
*/
function generateTagDiv(tag, id) {
	const div = document.createElement("div");
	div.setAttribute("class", "tag-div-layout");
	div.setAttribute("id", "tag" + id);
	const tagInput = document.createElement("input");
	tagInput.value = tag;
	tagInput.setAttribute("type", "text")
	tagInput.setAttribute("class", "tag-input");
	tagInput.setAttribute("id", "tagInput=" + id)
	tagInput.setAttribute("list", "list=" + id)
	const button = document.createElement("button");
	button.innerText = "\u2715";
	button.setAttribute("class", "delete-tag-button")
	button.onclick = () => {
		deleteTag(id);
	}
	tagInput.addEventListener("keydown", handleChangeToNextTag)
	tagInput.addEventListener("keyup", tagUpdate)
	div.appendChild(tagInput)
	div.appendChild(button)
	div.appendChild(getTagList("list=" + id))
	return div
}


/*
deletes tag
*/
function deleteTag(id) {
	tags.splice(id, 1)
	GalleryStore.getGallery().tags = tags
	generateTagsLayout()
}

/*
generates adding tag button
*/
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
/*
handles change to next or previous tag by clicking on tab/enter or backspace/delete
*/
function handleChangeToNextTag(event){
	const id = parseInt(event.srcElement.id.split("=")[1])

	if (event.key === "Tab" || event.key === "Enter"){
		event.preventDefault()
		if (id + 1 < tags.length){
			event.srcElement.blur()
			document.getElementById("tagInput=" + (id + 1)).focus()
		}else{
			tags.push("")
			GalleryStore.getGallery().tags = tags
			generateTagsLayout()
			document.getElementById("tagInput=" + (tags.length - 1)).focus()
		}
	}
	if ((event.key === "Backspace" || event.key === "Delete") && tags[id].length === 0){
		deleteTag(id)
		if(id > 0){
			document.getElementById("tagInput=" + (id - 1)).focus()
		}else if(id === 0 && tags.length > 0){
			document.getElementById("tagInput=" + 0).focus()
		}
	}

}

/*
updates tag in database on front end
 */

function tagUpdate(event){
	const id = parseInt(event.srcElement.id.split("=")[1])
	tags[id] = event.srcElement.value
}


/*
fills last line div with empty divs
*/

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
import {
    fetchAllGalleries
}from "./galleryFetcher.js"
import {
    createPopupWindow
}from "../photos/layoutGenerator.js"

/*
builds main page of gallery manager, one without photos
*/
async function buildMainLayout(isGallerySelected){
    const root = document.createElement("div")
    document.body.appendChild(root)
    const galTitles = await fetchAllGalleries()
    if(isGalleryInURL(galTitles)){

    }else{
        root.appendChild(buildGalleryChooser(galTitles))
    }
}

/*
creates selector for galleries if gallery is not choosen
*/
function buildGalleryChooser(galTitles){
    const div = document.createElement("div")
    const selector = document.createElement("input")
    selector.setAttribute("class", "text")
    selector.setAttribute("list", "galleryNames")
    const dataList = document.createElement("datalist")
    dataList.setAttribute("id", "galleryNames")
    let buffer = ""
    for (const title of galTitles){
        buffer += "<option>" + title + "</option>"
    }
    dataList.innerHTML = buffer
    div.appendChild(selector)
    div.appendChild(dataList)
    selector.addEventListener("keyup", (event) =>{
        if(event.key === "Enter" || event.key === undefined){
            if(isStringInArray(selector.value, galTitles)){
                console.log("fire")
            }else{
                if (selector.value.length > 0){
                    createPopupWindow("Gallery with title \"" + selector.value + "\" does not exists")
                }else{
                    createPopupWindow("Please fill in gallery title or choose from list")
                }
            }
        }
    })

    return div
}
/*
checks if gallery is in array and if url is not corrupted or empty
*/
function isGalleryInURL(galTitles){
    console.log(galTitles)
    const url = new URL(window.location.href)
    const param = url.searchParams.get("gallery-title")
    if(param === null){
        return false
    }
    return isStringInArray(param, galTitles)
    
}

/*
returns logic value if is string in array
*/
function isStringInArray(string, array){
    for (const s of array){
        if(s === string){
            return true
        }
    }
    return false
}



window.onload = () =>{
    buildMainLayout(false)
}
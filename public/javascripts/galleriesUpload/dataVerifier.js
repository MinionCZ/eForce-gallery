
let titles = null
let tags = null
let options = null
fetchGalleryInformation()

/*
fetcher synchronous data from backend -> tags and gallery titles
*/
async function fetchGalleryInformation() {
    let req = new XMLHttpRequest()
    req.open("GET", "/eforce-gallery/galleries/fetch-titles-and-tags", false)
    req.onload = () => {
        const data = JSON.parse(req.response)
        titles = new Set(data.titles)
        tags = data.tags
    }
    req.send()
}

/*
creates data list with already used tags for input
*/

function getDatalistWithTagsForInput(id) {
    let datalist = document.createElement("datalist")
    if (options === null) {
        options = ""
        for (const option of tags) {
            options += '<option value="' + option + '"/>'
        }
    }
    datalist.innerHTML = options
    datalist.setAttribute("id", "list" + id)
    return datalist
}

/*
checks if title is not already used
*/

function isTitleUsed() {
    let value = document.getElementById("title").value
    value = cropSpaces(value)
    if (value.length > 0) {
        document.getElementById("submitButton").disabled = titles.has(value)
    } else {
        document.getElementById("submitButton").disabled = true
    }

}

function cropSpaces(string) {
    while (string.charAt(string.length - 1) === ' ' && string.length > 0) {
        string = string.slice(0, -1)
    }
    while(string.charAt(0) === ' ' && string.length > 0){
        string = string.substring(1)
    }
    return string
}
export {
    getDatalistWithTagsForInput,
    isTitleUsed,
    cropSpaces
}
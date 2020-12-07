
let titles = null
let tags = null
let options = null
fetchGalleryInformation()

/*
fetcher synchronous data from backend -> tags and gallery titles
*/
async function fetchGalleryInformation(){
    let req = new XMLHttpRequest()
    req.open("GET", "/galleries/fetch-titles-and-tags", false)
    req.onload = () =>{
        const data = JSON.parse(req.response)
        titles = new Set(data.titles)
        tags = data.tags
    }
     req.send()
}

/*
creates data list with already used tags for input
*/

function getDatalistWithTagsForInput(id){
    let datalist = document.createElement("datalist")
    if(options === null){
        options = ""
        for (const option of tags){
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

function isTitleUsed(){
    
    if (document.getElementById("title").value.length > 0){
        const title = document.getElementById("title").value.toLowerCase()
        document.getElementById("submitButton").disabled = titles.has(title)
    }else{
        document.getElementById("submitButton").disabled = true
    }

}

export{
    getDatalistWithTagsForInput,
    isTitleUsed
}
/**
 * fetches info of all galleries
 * @returns returns array of strings with names of galleries
 */
async function fetchAllGalleries(){
    const response = await fetch("/eforce-gallery/galleries/get-all", {
        method: "GET",
        headers: {
            'Content-Type': 'application/json'
        },
    })
    return parseGalleryTitles(await response.json())
}
/*
parses title from json
*/
function parseGalleryTitles(jsonTitles){
    const titles = []
    for (const title of jsonTitles){
        titles.push(title.title)
    }
    return titles
}

async function fetchGalleryByTitle(title){
    const response = await fetch("/eforce-gallery/fetch-gallery-by-title", {
        headers:{
            'Content-Type': 'application/json'
        },
        method: "POST",
        body: JSON.stringify({
            title:title
        })
    })
    return await response.json()
}

export {
    fetchAllGalleries,
    fetchGalleryByTitle
}
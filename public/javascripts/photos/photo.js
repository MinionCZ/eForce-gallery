class Photo{
    constructor(jsonObject){
        this.fileName = jsonObject.fileName
        this.width = jsonObject.width
        this.height = jsonObject.height
        this.tags = jsonObject.tags
        this.galleries = jsonObject.galleryTitles
        this.contributionDate = jsonObject.dateOfContribution
    }
    getDivForRender(){
        const root = document.createElement("div")
        root.setAttribute("id", "photoDiv")
        root.setAttribute("class", "photo-div")
        const picture = document.createElement("img")
        picture.setAttribute("src", this.getImageLink(true))
        picture.setAttribute("class", "thumbnail")
        root.appendChild(picture)
        return root
    }
    getImageLink(thumbnail = false){
        return "/photos/fetch-photo-by-id?fileName=" + this.fileName + "&thumbnail=" + thumbnail
    }

}
export{
    Photo
}
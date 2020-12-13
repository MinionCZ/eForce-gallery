class Photo{
    constructor(jsonObject){
        this.fileName = jsonObject.fileName
        this.width = jsonObject.width
        this.height = jsonObject.height
        this.tags = jsonObject.tags
        this.galleries = jsonObject.galleryTitles
        this.contributionDate = jsonObject.dateOfContribution
        this.thumbnailHeight = 0
        this.thumbnailWidth = 0
    }
    getDivForRender(){
        const root = document.createElement("div")
        root.setAttribute("id", "photoDiv")
        root.setAttribute("class", "photo-div")
        const picture = document.createElement("img")
        picture.setAttribute("src", this.getImageLink(true))
        picture.setAttribute("class", "thumbnail")
        picture.setAttribute("width", "420px")
        picture.setAttribute("height", "280px")
        root.appendChild(picture)
        return root
    }
    getImageLink(thumbnail = false){
        return "/photos/fetch-photo-by-id?fileName=" + this.fileName + "&thumbnail=" + thumbnail
    }

    getThumbnailSize(){
        
    }

}
export{
    Photo
}
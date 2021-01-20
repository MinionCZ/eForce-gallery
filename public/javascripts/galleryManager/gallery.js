class Gallery{
    constructor(dataInJson){
        this.title = dataInJson.galleryTitle
        this.galleryID = dataInJson.galleryID
        this.liteSize = dataInJson.liteSizeInMB
        this.fullSize = dataInJson.fullSizeInMB
        this.label = dataInJson.galleryLabel
        this.eventDate = dataInJson.dateOfEvent
        this.contributor = dataInJson.nameOfContributor
        this.contributionDate = dataInJson.contributionDate
        this.lastChanges = dataInJson.lastChanges
        this.lastChangesTime = dataInJson.lastChangesTime
        this.photos = dataInJson.photos
    }

}
export{
    Gallery
}
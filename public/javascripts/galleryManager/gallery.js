class Gallery{
    constructor(dataInJson){
        this.title = dataInJson.galleryTitle
        this.galleryID = dataInJson.galleryID
        this.liteSize = this.cropLengthOfSizes(dataInJson.liteSizeInMB)
        this.fullSize = this.cropLengthOfSizes(dataInJson.fullSizeInMB)
        this.label = dataInJson.galleryLabel
        this.eventDate = dataInJson.dateOfEvent
        this.contributor = dataInJson.nameOfContributor
        this.contributionDate = dataInJson.contributionDate
        this.lastChanges = dataInJson.lastChanges
        this.lastChangesTime = dataInJson.lastChangesTime
        this.photos = dataInJson.photos
        this.tags = dataInJson.tags
        console.log(dataInJson)
    }

    /*
    adds units and crops length of number of size of gallery
    */
    cropLengthOfSizes(size){
        let newSize = parseFloat(size)
        let units = "MB"
        if(newSize > 1000){
            newSize /= 1000
            units = "GB"
        }
        newSize *= 100
        newSize = Math.floor(newSize)
        newSize /= 100
        return newSize + units
    }

}
export{
    Gallery
}
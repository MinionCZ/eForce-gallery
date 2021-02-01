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
        this.tags = this.cropEmptyTags(dataInJson.tags)
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

    cropEmptyTags(tags){
        const croppedTags = []
        for(const tag of tags){
            if(tag.length > 0){
                croppedTags.push(tag)
            }
        }
        return croppedTags
    }

}
export{
    Gallery
}
class GalleryPreview {
    static shadowDiv = new Object()
    static rootDiv = new Object()
    static createPreview(gallery) {
        this.shadowDiv = this.createShadowDiv()
        this.rootDiv = this.createRootDiv()
        this.shadowDiv.appendChild(this.rootDiv)
        document.body.appendChild(this.shadowDiv)
        this.putAllComponentsTogether(gallery)
        this.gallery = gallery
        this.shadowDiv.onclick = (event) => {
            if (event.target.id === "shadowDiv") {
                document.body.removeChild(this.shadowDiv)
            }
        }
    }

    static createShadowDiv() {
        let shadowDiv = document.createElement("div")
        shadowDiv.setAttribute("id", "shadowDiv")
        shadowDiv.setAttribute("class", "shadowDiv")
        return shadowDiv
    }

    static createRootDiv() {
        let rootDiv = document.createElement("div")
        rootDiv.setAttribute("class", "rootDiv")
        rootDiv.setAttribute("id", "rootDiv")
        return rootDiv
    }
    static renderTitle(gallery) {
        let header = document.createElement("h1")
        header.textContent = gallery.title
        header.setAttribute("class", "title")
        return header
    }
    static renderImage(gallery) {
        let imageDiv = document.createElement("div")
        let image = document.createElement("img")
        image.setAttribute("class", "previewImage")
        image.setAttribute("src", gallery.photoURL)
        imageDiv.appendChild(image)
        imageDiv.setAttribute("class", "imageDiv")
        return imageDiv
    }
    static renderStatsDiv(gallery) {
        let statsDiv = gallery.generateStatsDiv()
        statsDiv.setAttribute("class", "previewStatsDiv")
        return statsDiv
    }
    static renderButton(text, cssClass) {
        let button = document.createElement("button")
        button.setAttribute("class", cssClass)
        button.textContent = text
        return button
    }
    static renderButtonRowDownload() {
        let buttonRow = document.createElement("div")
        buttonRow.setAttribute("class", "buttonRow")
        let downloadButton = this.renderButton("Download", "downloadButton")
        let downloadLiteButton = this.renderButton("Download lite version", "liteVersionButton")
        downloadButton.onclick = () => {
            if (this.gallery.photosCount === 0) {
                alert("This gallery is empty")
            }else{
                this.sendRequestToDownloadGallery(this.gallery.id, "full")
            }
        }
        downloadLiteButton.onclick = () => {
            if (this.gallery.photosCount === 0) {
                alert("This gallery is empty")
            }else{
            this.sendRequestToDownloadGallery(this.gallery.id, "lite")
            }
        }
        buttonRow.appendChild(downloadButton)
        buttonRow.appendChild(downloadLiteButton)
        return buttonRow
    }

    static renderButtonRowManage() {
        let buttonRow = document.createElement("div")
        buttonRow.setAttribute("class", "buttonRowBottom")
        let manageButton = this.renderButton("Manage gallery", "manageButton")
        let deleteButton = this.renderButton("Delete gallery", "deleteButton")
        manageButton.onclick = () => {
            const newUrl = location.protocol + "//" + location.host + "/eforce-gallery/gallery-manager"
            const url = new URL(newUrl)
            url.searchParams.set("gallery-title", this.gallery.title)
            window.location.href = url
        }
        deleteButton.onclick = () => {
            if (confirm("Are you sure you want to delete this gallery?")){
                this.deleteGallery()
            }
        }
        buttonRow.appendChild(manageButton)
        buttonRow.appendChild(deleteButton)
        return buttonRow
    }

    static putAllComponentsTogether(gallery) {
        this.rootDiv.appendChild(this.renderTitle(gallery))
        this.rootDiv.appendChild(this.renderImage(gallery))
        this.rootDiv.appendChild(this.renderStatsDiv(gallery))
        this.rootDiv.appendChild(this.renderButtonRowDownload())
        this.rootDiv.appendChild(this.renderButtonRowManage())
    }

    static createFormForGalleryDownload(url, galleryID, version){
        const form = document.createElement("form")
        form.setAttribute("method", "post")
        form.setAttribute("action", url)
        
        const idInput = document.createElement("input")
        idInput.setAttribute("name", "galleryID")
        idInput.setAttribute("type", "text")
        idInput.setAttribute("value", galleryID)

        const versionInput = document.createElement("input")
        versionInput.setAttribute("type", "hidden")
        versionInput.setAttribute("name", "version")
        versionInput.setAttribute("value", version)

        form.appendChild(idInput)
        form.appendChild(versionInput)
        return form
    }


    static deleteGallery(){
        const form = document.createElement("form")
        form.setAttribute("method", "post")
        form.setAttribute("action", "/eforce-gallery/delete/gallery")

        const idInput = document.createElement("input")
        idInput.setAttribute("name", "galleryID")
        idInput.setAttribute("type", "text")
        idInput.setAttribute("value", this.gallery.id)

        form.appendChild(idInput)
        document.body.appendChild(form)
        form.submit()
        document.body.removeChild(form)

    }


    static async sendRequestToDownloadGallery(galleryID, version) {
        let url = "/eforce-gallery/photo-gallery/download-whole-gallery"
        const form = this.createFormForGalleryDownload(url, galleryID, version)
        document.body.appendChild(form)
        form.submit()
        document.body.removeChild(form)
    }

}
export {
    GalleryPreview
}
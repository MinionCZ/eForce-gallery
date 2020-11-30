import {appendUrlParam} from "../urlMapping.js"
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
                this.sendRequestToDownloadGallery(this.gallery.title, "full")
            }
        }
        downloadLiteButton.onclick = () => {
            if (this.gallery.photosCount === 0) {
                alert("This gallery is empty")
            }else{
            this.sendRequestToDownloadGallery(this.gallery.title, "lite")
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
            alert("manage")
        }
        deleteButton.onclick = () => {
            alert("delete")
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

    static createFormForGalleryDownload(url, galleryTitle, version){
        const form = document.createElement("form")
        form.setAttribute("method", "post")
        form.setAttribute("action", url)
        
        const titleInput = document.createElement("input")
        titleInput.setAttribute("name", "title")
        titleInput.setAttribute("type", "text")
        titleInput.setAttribute("value", galleryTitle)

        const versionInput = document.createElement("input")
        versionInput.setAttribute("type", "hidden")
        versionInput.setAttribute("name", "version")
        versionInput.setAttribute("value", version)

        form.appendChild(titleInput)
        form.appendChild(versionInput)
        console.log(form.children)
        return form
    }



    static async sendRequestToDownloadGallery(galleryTitle, version) {
        let url = "/photo-gallery/download-whole-gallery"
        const form = this.createFormForGalleryDownload(url, galleryTitle, version)
        document.body.appendChild(form)
        form.submit()
        document.body.removeChild(form)
    }

}
export {
    GalleryPreview
}

class GalleryPreview{
    static shadowDiv = new Object()
    static rootDiv = new Object()
    static createPreview(gallery){
        this.shadowDiv = this.createShadowDiv()
        this.rootDiv = this.createRootDiv()
        this.shadowDiv.appendChild(this.rootDiv)
        document.body.appendChild(this.shadowDiv)
        this.putAllComponentsTogether(gallery)
        this.shadowDiv.onclick = (event) =>{
            if(event.target.id === "shadowDiv"){
                document.body.removeChild(this.shadowDiv)
            }
        }
       window.addEventListener("DOMMouseScroll", preventDefault, false)
    }

    static createShadowDiv(){
        let shadowDiv = document.createElement("div")
        shadowDiv.setAttribute("id", "shadowDiv")
        shadowDiv.setAttribute("class", "shadowDiv")
        return shadowDiv
    }
    
    static createRootDiv(){
        let rootDiv = document.createElement("div")
        rootDiv.setAttribute("class", "rootDiv")
        rootDiv.setAttribute("id", "rootDiv")
        return rootDiv
    }
    static renderTitle(gallery){
        let header = document.createElement("h1")
        header.textContent = gallery.title
        header.setAttribute("class", "title")
        return header
    }
    static renderImage(gallery){
        let image = document.createElement("img")
        image.setAttribute("class", "previewImage")
        image.setAttribute("src" , gallery.photoURL)
        return image
    }
    static renderStatsDiv(gallery){
        let statsDiv = gallery.generateStatsDiv()
        statsDiv.setAttribute("class", "previewStatsDiv")
        return statsDiv
    }
    static renderButton(text, cssClass){
        let button = document.createElement("button")
        button.setAttribute("class", cssClass)
        button.textContent = text
        return button
    }
    static renderButtonRowDownload(){
        let buttonRow = document.createElement("div")
        buttonRow.setAttribute("class", "buttonRow")
        let downloadButton = this.renderButton("Download", "downloadButton")
        let downloadLiteButton = this.renderButton("Download lite version", "liteVersionButton")
        downloadButton.onclick = () =>{
            alert("download")
        }
        downloadLiteButton.onclick = () =>{
            alert("download lite version")
        }
        buttonRow.appendChild(downloadButton)
        buttonRow.appendChild(downloadLiteButton)
        return buttonRow
    }

    static renderButtonRowManage(){
        let buttonRow = document.createElement("div")
        buttonRow.setAttribute("class", "buttonRowBottom")
        let manageButton = this.renderButton("Manage gallery", "manageButton")
        let deleteButton = this.renderButton("Delete gallery", "deleteButton")
        manageButton.onclick = () =>{
            alert("manage")
        }
        deleteButton.onclick = () =>{
            alert("delete")
        }
        buttonRow.appendChild(manageButton)
        buttonRow.appendChild(deleteButton)
        return buttonRow
    }

    static putAllComponentsTogether(gallery){
        this.rootDiv.appendChild(this.renderTitle(gallery))
        this.rootDiv.appendChild(this.renderImage(gallery))
        this.rootDiv.appendChild(this.renderStatsDiv(gallery))
        this.rootDiv.appendChild(this.renderButtonRowDownload())
        this.rootDiv.appendChild(this.renderButtonRowManage())
    }

}
export {GalleryPreview}
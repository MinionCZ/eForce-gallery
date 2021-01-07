import { GallerySort } from "./gallerySort.js"

import {
    GalleryStore
} from "./galleryStore.js"


class GalleryRender {
    static maxRenderedGalleries = 40
    static renderedDivs = []

    static createLineDiv(index){
        let lineDiv = document.createElement("div")
        lineDiv.setAttribute("id", "lineDiv" + index)
        lineDiv.setAttribute("class", "lineDiv")
        return lineDiv
    }

    static renderGalleries(galleries, highlightText) {
        let max = Math.min(this.maxRenderedGalleries, galleries.length)
        this.clearPage()
        let index = 0
        let innerIndex = 0
        let counter = 0
        const divsToRender = []
        divsToRender.push(this.createLineDiv(0))
        for (const gallery of galleries){
            if(innerIndex === 4){
                index++
                innerIndex = 0
                divsToRender.push(this.createLineDiv(index))
            }
            if(counter < max){
                divsToRender[index].appendChild(gallery.renderDiv())
            }
            gallery.highlightText(highlightText)
            counter++
            innerIndex++
        }
        this.createLayout(divsToRender)
        this.colorizeAllTags(galleries)

    }

    static createLayout(lineDivs){
        this.renderedDivs = []
        for(let lineDiv of lineDivs){
            document.body.appendChild(lineDiv)
            this.renderedDivs.push(lineDiv)
        }
        this.renderedDivs[this.renderedDivs.length - 1].setAttribute("class", "last-line-div")
    }
    static clearPage(){
        for(let i = 0; i<this.renderedDivs.length; i++){
            document.body.removeChild(document.getElementById("lineDiv" + i))
        }
    }

    static colorizeAllTags(galleries){
        const clickedTags = GallerySort.getClickedTags()
        for(const tag of clickedTags){
            const color = GalleryStore.getColorForTag(tag)
            for (const gallery of galleries){
                gallery.changeTagColor(tag, color)
            }
        }
    }
}
export {
    GalleryRender
}
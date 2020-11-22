import {
    Gallery
} from "./gallery.js"
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
        for(let lineDiv of lineDivs){
            document.body.appendChild(lineDiv)
            this.renderedDivs.push(lineDiv)
        }
    }
    static clearPage(){
        for(const lineDiv of this.renderedDivs){
            let maxElement = lineDiv.childElementCount
            for(let i = 0; i < maxElement; i++){
                lineDiv.innerHTML = ""
            }
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
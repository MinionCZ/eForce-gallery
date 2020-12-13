import {PhotosStore} from "./photosStore.js"

function toggleSideBar(event){
    const value =event.target.value
    
    let toggle = false
    let size = "0px"
    toggle = !PhotosStore.getToggleState(value)
    if (toggle){
        size = "200px"
    }

    document.getElementById(value).style.width = size
    PhotosStore.setToggleState(toggle, value)
}
export{toggleSideBar}
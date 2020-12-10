import {PhotosStore} from "./photosStore.js"
window.onload = () =>{
PhotosStore.fetchPage(1, 40)
}
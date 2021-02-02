/*
creates confirm window for user confirmation
*/
function createConfirmWindow(text, callback){
    const root = document.createElement("div")
    root.setAttribute("class", "root-confirm-window")
    root.setAttribute("id", "confirmWindowRoot")
    const div = document.createElement("div")
    div.setAttribute("class", "confirm-window-div")

    const title = document.createElement("h2")
    title.innerText = text
    root.appendChild(div)
    div.appendChild(title)
    div.appendChild(createButton("Confirm", "confirm-window-button confirm", callback))
    div.appendChild(createButton("Cancel", "confirm-window-button cancel", closeConfirmWindow))
    div.appendChild(createButton("\u2715", "confirm-window-exit", closeConfirmWindow))
    document.body.appendChild(root)
}
/*
creates button for confirm window by params
*/
function createButton(text, cssClass, callback){
    const button = document.createElement("button")
    button.setAttribute("class", cssClass)
    button.innerText = text
    button.onclick = () =>{
        callback()
    }
    return button

}
/*
closes confirm window
*/
function closeConfirmWindow(){
    if(document.body.contains(document.getElementById("confirmWindowRoot"))){
        document.body.removeChild(document.getElementById("confirmWindowRoot"))
    }
}
export{
    createConfirmWindow
}
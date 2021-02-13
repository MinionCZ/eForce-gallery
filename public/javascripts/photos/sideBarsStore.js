class SideBarsStore{
    static tagsState = "and"
    static galleriesState = "and"
    static setState(type, state){
        if(type === "gallery"){
           this.galleriesState = state
        }else{
           this.tagsState = state
        }
    }
    static getState(type){
        if(type === "gallery"){
            return this.galleriesState
        }else{
            return this.tagsState
        }
    }

}
export{
    SideBarsStore
}
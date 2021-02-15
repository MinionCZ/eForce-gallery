class SideBarsStore{
    static tagsState = "and"
    static galleriesState = "and"
    static galleries = []
    static tags = []
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

    static updatePhotosByQuery(galleries, tags){
        this.galleries = Array.from(galleries)
        this.tags = Array.from(tags)
    }
    static exportData(){
        return{
            tagsState : this.tagsState,
            galleriesState: this.galleriesState,
            galleries: this.galleries,
            tags: this.tags
        }
    }
}
export{
    SideBarsStore
}
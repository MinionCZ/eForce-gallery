function changeMapping(mapping) {
    switch (mapping) {
        case "dashboard":
            window.location = "/dashboard"
            break
        case "newGallery":
            window.location = "/gallery/add"
            break
        case "galleries":
            window.location = "/galleries"
            break
        case "photos":
            window.location = "/photos"
            break
        default:
            window.location = "/dashboard"
            break
    }
}
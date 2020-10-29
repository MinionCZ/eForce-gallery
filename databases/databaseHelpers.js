function convertDateFromHTML(date) {
    let datePieces = date.split("-")
    return datePieces[2] + "." + datePieces[1] + "." + datePieces[0]
}

function convertDateToHTML(date) {
    let datePieces = date.split(".")
    return datePieces[2] + "-" + datePieces[1] + "-" + datePieces[0]
}

module.exports = {
    convertDateToHTML,
    convertDateFromHTML
}
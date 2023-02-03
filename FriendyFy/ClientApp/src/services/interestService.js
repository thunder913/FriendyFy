function getAllInterests(){
    return fetch('/interest', {
        method: 'GET'
    })
}

export {
    getAllInterests,
}
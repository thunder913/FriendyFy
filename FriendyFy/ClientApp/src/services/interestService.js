function getAllInterests(){
    return fetch('/api/interest', {
        method: 'GET'
    })
}

export {
    getAllInterests,
}
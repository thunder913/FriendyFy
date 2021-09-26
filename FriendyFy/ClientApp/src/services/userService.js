function getLoggedInUser(){
    return fetch('/api/user', {
        method: 'GET',
        headers: {'Content-Type': 'application/json'},
    })
}

function logout(){
    return fetch('api/logout', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
    });
}

export {
    getLoggedInUser,
    logout
}
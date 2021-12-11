function getLoggedInUser(){
    return fetch('/api/user', {
        method: 'GET',
        headers: {'Content-Type': 'application/json'},
    })
}

function logout(){
    return fetch('/api/logout', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
    });
}

function confirmEmail(userId, code){
    return fetch('/api/confirmEmail', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(
            {
                userId, code
            })
    });
}

function finishFirstTimeSetup(data){
    return fetch('/api/FinishFirstTimeSetup', {
        method: 'POST',
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        body: JSON.stringify(data)
    });
}

function getUserLocation(userId){
    return fetch('/user/getLocation', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(userId)
    });
}

function getUserEventsCount(userId){
    return fetch('/user/getEventsCount', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(userId)
    });
}

function getUserImages(username, take, skip){
    return fetch('/api/getUserImages', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({username, take, skip})
    });
}

function changeUserTheme(username, theme){
    return fetch('/user/changeTheme', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({username, theme})
    });
}

function getUserData(){
    return fetch('/api/getUserData', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
    });
}

function register(firstName, lastName, birthday, gender, password, confirmPassword, email, theme){
    return fetch('/api/register', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({firstName, lastName, birthday, gender, password, confirmPassword, email, theme})
    });
}

function login(email, password){
    return fetch('/api/login', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({email, password})
    });
}

export {
    getLoggedInUser,
    logout,
    confirmEmail,
    finishFirstTimeSetup,
    getUserLocation,
    getUserEventsCount,
    getUserImages,
    changeUserTheme,
    getUserData,
    register,
    login
}
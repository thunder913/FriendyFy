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
    return fetch(`/user/${userId}/location`, {
        method: 'GET',
        headers: {'Content-Type': 'application/json'},
    });
}

function getUserEventsCount(userId){
    return fetch(`/user/${userId}/events`, {
        method: 'GET',
        headers: {'Content-Type': 'application/json'},
    });
}

function getUserImages(username, take, skip){
    return fetch('/api/UserImages?' + new URLSearchParams({username, take, skip}), 
    {
        method: 'GET',
        headers: {'Content-Type': 'application/json'},
    });
}

function changeUserTheme(username, theme){
    return fetch('/user/theme/change', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({username, theme})
    });
}

function getUserData(){
    return fetch('/api/UserData', {
        method: 'GET',
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

function forgotPassword(email){
    return fetch('/api/forgotPassword', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({email})
    });
}

function resetPassword(email, password, confirmPassword, code){
    return fetch('/api/resetPassword', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({email, password, confirmPassword, code})
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
    login,
    forgotPassword,
    resetPassword
}
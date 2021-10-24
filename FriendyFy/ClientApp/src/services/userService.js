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

function addFriend(data){
    return fetch('/friend/add', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data)
    });
}

function cancelFriendRequest(data){
    return fetch('/friend/cancel', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data)
    });
}

function acceptFriendRequest(data){
    return fetch('/friend/accept', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data)
    });
}

function removeFriend(data){
    return fetch('/friend/remove', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data)
    });
}

function checkFriendStatus(data){
    return fetch('/friend/checkFriendStatus', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data)
    });
}

function getFriends(userId, count){
    return fetch('/friend/getFriends', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({userId, count})
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

function getRecommendedFriends(){
    return fetch('/friend/getRecommendations', {
        method: 'POST',
    });
}


export {
    getLoggedInUser,
    logout,
    confirmEmail,
    finishFirstTimeSetup,
    addFriend,
    checkFriendStatus,
    cancelFriendRequest,
    acceptFriendRequest,
    removeFriend,
    getFriends,
    getUserLocation,
    getUserEventsCount,
    getRecommendedFriends
}
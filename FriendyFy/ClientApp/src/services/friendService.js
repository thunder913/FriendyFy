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

function getFriends(userId, count, skip, searchQuery){
    return fetch('/friend/getFriends', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({userId, count, skip: skip, searchQuery: searchQuery})
    });
}

function getRecommendedFriends(){
    return fetch('/friend/getRecommendations', {
        method: 'POST',
    });
}

function removeFriendSuggestion(data){
    return fetch('/friend/removeSuggestion', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data)
    });
}

function getRightNavigationSuggestions(){
    return fetch('/friend/getRightNavSuggestions', {
        method: 'POST'
    });
}

export {
    addFriend,
    checkFriendStatus,
    cancelFriendRequest,
    acceptFriendRequest,
    removeFriend,
    getFriends,
    getRecommendedFriends,
    removeFriendSuggestion,
    getRightNavigationSuggestions
}
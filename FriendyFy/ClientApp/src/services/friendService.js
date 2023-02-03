function addFriend(data){
    return fetch('/friend', {
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
    return fetch('/friend', {
        method: 'DELETE',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data)
    });
}

function checkFriendStatus(userId){
    return fetch(`/friend/status/${userId}`, {
        method: 'GET',
        headers: {'Content-Type': 'application/json'},
    });
}

function getFriends(userId, count, skip, searchQuery){
    return fetch('/friend?' + new URLSearchParams({userId, count, skip, searchQuery}), {
        method: 'GET',
        headers: {'Content-Type': 'application/json'},
    });
}

function getRecommendedFriends(){
    return fetch('/friend/recommendations', {
        method: 'GET',
    });
}

function removeFriendSuggestion(data){
    return fetch('/friend/suggestion', {
        method: 'DELETE',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data)
    });
}

function getRightNavigationSuggestions(){
    return fetch('/friend/suggestions', {
        method: 'GET'
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
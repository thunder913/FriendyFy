export function getChats(username) {
    return fetch('/chat/getChats/'+username, {
        method: 'GET',
    });
  }

  export function getChat(username, chatId, take, skip) {
    return fetch('/chat/getChat', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({username, chatId, take, skip})
    });
  }
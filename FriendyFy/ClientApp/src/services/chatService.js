export function getChats(username, page, take, search, itemsPerPage) {
    return fetch('/chat/getChats', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({username, page, take, search, itemsPerPage})
    });
  }

  export function getChat(username, chatId, take, skip) {
    return fetch('/chat/getChat', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({username, chatId, take, skip})
    });
  }

  export function sendMessage(chatId, message){
    return fetch('/chat/sendMessage', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({chatId, message})
    });
  }

  export function seeMessages(chatId){
    return fetch('/chat/seeMessages', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({chatId})
    });
  }
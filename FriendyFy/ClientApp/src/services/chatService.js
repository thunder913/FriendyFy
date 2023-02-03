export function getChats(username, page, take, search, itemsPerPage, chatIds) {
    return fetch('/chat/all?' + new URLSearchParams({username, page, take, search, itemsPerPage, chatIds}), {
        method: 'GET',
        headers: {'Content-Type': 'application/json'},
    });
  }

  export function getChat(username, chatId, take, skip) {
    return fetch('/chat?' + new URLSearchParams({username, chatId, take, skip}), {
        method: 'GET',
        headers: {'Content-Type': 'application/json'},
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
    return fetch('/chat/see', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({chatId})
    });
  }
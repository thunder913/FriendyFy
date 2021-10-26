export function getChats(username) {
    return fetch('/chat/getChats/'+username, {
        method: 'GET',
    });
  }
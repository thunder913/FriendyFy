
  export function getuserNotifications(userId, take, skip) {
    return fetch('/notification/getForUser', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({userId, take, skip})
    });
  }
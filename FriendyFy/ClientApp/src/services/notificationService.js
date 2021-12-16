  export function getuserNotifications(userId, take, skip) {
    return fetch('/notification/getForUser', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({userId, take, skip})
    });
  }
  
  export function acceptNotificationEvent(notificationId) {
    return fetch('/notification/acceptEvent', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({notificationId})
    });
  }

  export function rejectNotificationEvent(notificationId) {
    return fetch('/notification/rejectEvent', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({notificationId})
    });
  }
  
  export function seeNotification(notificationId) {
    return fetch('/notification/seeNotification', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({notificationId})
    });
  }

  export function getUnseenCount() {
    return fetch('/notification/getUnseen', {
        method: 'POST',
    });
  }
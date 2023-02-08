  export function getuserNotifications(userId, take, skip) {
    return fetch('/notification/user?' + new URLSearchParams({userId, take, skip}), {
        method: 'GET',
        headers: {'Content-Type': 'application/json'},
    });
  }
  
  export function acceptNotificationEvent(notificationId) {
    return fetch('/notification/accept/event', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({notificationId})
    });
  }

  export function rejectNotificationEvent(notificationId) {
    return fetch('/notification/reject/event', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({notificationId})
    });
  }
  
  export function seeNotification(notificationId) {
    return fetch('/notification/see', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({notificationId})
    });
  }

  export function getUnseenCount() {
    return fetch('/notification/unseen', {
        method: 'GET',
    });
  }
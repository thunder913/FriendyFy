export function searchUsersAndEvents(searchWord, take, usersCount, eventsCount) {
    return fetch('/search', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({searchWord, take, usersCount, eventsCount})
    });
  }
export function searchUsersAndEvents(searchWord, take, usersCount, eventsCount) {
    return fetch('/search', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({searchWord, take, usersCount, eventsCount})
    });
  }

  export function performSearchPageSearch(searchWord, type, interests, showOnlyUserEvents, eventDate, take, skipPeople, skipEvents) {
    return fetch('/search/search', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({searchWord, type, interests, showOnlyUserEvents, eventDate, take, skipPeople, skipEvents})
    });
  }
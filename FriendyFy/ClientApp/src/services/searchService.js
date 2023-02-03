export function searchUsersAndEvents(searchWord, take, usersCount, eventsCount) {
    return fetch('/search?' + new URLSearchParams({searchWord, take, usersCount, eventsCount}), {
        method: 'GET',
        headers: {'Content-Type': 'application/json'},
    });
  }

  export function performSearchPageSearch(searchWord, type, interests, showOnlyUserEvents, eventDate, take, skipPeople, skipEvents) {
    return fetch('/search', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({searchWord, type, interests, showOnlyUserEvents, eventDate, take, skipPeople, skipEvents})
    });
  }
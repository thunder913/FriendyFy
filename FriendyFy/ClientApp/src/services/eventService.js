export function createEvent(name, date, interests, privacyOptions, latitude, longitude, description, image, isReocurring = null, reocurringFrequency = null){
    return fetch('/event', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({name, date, interests, privacyOptions, latitude, longitude, description, image})
    });
}

export function getEventById(eventId){
    return fetch(`/event/${eventId}`, {
        method: 'GET',
        headers: {'Content-Type': 'application/json'},
    })
}

export function likeEvent(eventId) {
    return fetch('/event/like', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({postId: eventId})
    });
  }

  export function joinEvent(eventId) {
    return fetch('/event/join', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({eventId})
    });
  }

  export function shareEvent(eventId) {
    return fetch('/event/share', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({eventId})
    });
  }

  export function getNavigationEvents() {
    return fetch('/event/navigationEvents', {
        method: 'GET',
    });
  }


  export function addImageToEvent(eventId, image) {
    return fetch('/event/image', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({eventId, image})
    });
  }

  export function leaveEvent(eventId) {
    return fetch('/event/leave', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({eventId})
    });
  }

  export function deleteEvent(eventId) {
    return fetch('/event', {
        method: 'DELETE',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({eventId})
    });
  }

  export function getRandomEvent() {
    return fetch('/event/random', {
        method: 'GET'
    });
  }

  export function getEventInvitePeople(eventId, skip, take) {
    return fetch('/event/invited?' + new URLSearchParams({eventId, skip, take}), {
        method: 'GET',
        headers: {'Content-Type': 'application/json'},
    });
  }
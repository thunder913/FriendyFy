export function createEvent(name, date, interests, privacyOptions, latitude, longitude, description, image, isReocurring, reocurringFrequency = null){
    return fetch('/event/create', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({name, date, interests, privacyOptions, latitude, longitude, description, image, isReocurring, reocurringFrequency})
    });
}

export function getEventById(id){
    return fetch('/event/getById', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({id})
    })
}

export function getEvents(){
    return fetch('/event', {
        method: 'GET'
    })
}

export function likeEvent(eventId) {
    return fetch('/event/likeEvent', {
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
    return fetch('/event/getNavEvents', {
        method: 'POST',
    });
  }


  export function addImageToEvent(eventId, image) {
    return fetch('/event/addImage', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({eventId, image})
    });
  }

  export function leaveEvent(eventId) {
    return fetch('/event/leaveEvent', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({eventId})
    });
  }
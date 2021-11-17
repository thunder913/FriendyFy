export function makePost(privacySetting, postMessage, locationLat, locationLng, image, people) {
    return fetch('/post/make', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({privacySetting, postMessage, locationLat, locationLng, image, people})
    });
  }
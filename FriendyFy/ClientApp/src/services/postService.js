export function makePost(privacySetting, postMessage, locationLat, locationLng, image, people) {
    return fetch('/post/make', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({privacySetting, postMessage, locationLat, locationLng, image, people})
    });
  }

  export function getPosts() {
    return fetch('/post/getPosts', {
        method: 'GET',
    });
  }

  export function likePost(postId) {
    return fetch('/post/likePost', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({postId})
    });
  }

  
  export function getPostLikes(postId, postType, skip, take) {
    return fetch('/post/getLikes', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({postId, postType, take, skip})
    });
  }

  export function getTaggedPeople(postId, skip, take) {
    return fetch('/post/getTaggedPeople', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({postId, take, skip})
    });
  }

  export function getPostByImageId(imageId) {
    return fetch('/post/getByImageId', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({imageId})
    });
  }

  export function repost(postId, text, type) {
    return fetch('/post/repost', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({postId, text, type})
    });
  }

  export function getPostReposts(postId, postType, skip, take) {
    return fetch('/post/getReposts', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({postId, postType, take, skip})
    });
  }

  export function deletePost(postId, postType) {
    return fetch('/post/deletePost', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({postId, postType})
    });
  }
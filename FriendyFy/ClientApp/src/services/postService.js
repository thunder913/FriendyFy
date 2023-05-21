export function makePost(privacySetting, postMessage, locationLat, locationLng, image, people) {
    return fetch('/post', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({privacySetting, postMessage, locationLat, locationLng, image, people})
    });
  }

  export function getPosts() {
    return fetch('/post', {
        method: 'GET',
    });
  }

  export function likePost(postId) {
    return fetch('/post/like', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({postId})
    });
  }
  
  export function getPostLikes(postId, postType, skip, take) {
    return fetch('/post/likes?' + new URLSearchParams({postId, postType, skip, take}), {
        method: 'GET',
        headers: {'Content-Type': 'application/json'},
    });
  }

  export function getTaggedPeople(postId, skip, take) {
    return fetch('/post/tagged?' + new URLSearchParams({postId, skip, take}), {
        method: 'GET',
        headers: {'Content-Type': 'application/json'},
    });
  }

  export function getPostByImageId(imageId) {
    return fetch(`/post/image/${imageId}`, {
        method: 'GET',
        headers: {'Content-Type': 'application/json'},
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
    return fetch('/post/reposts?' + new URLSearchParams({postId, postType, skip, take}) , {
        method: 'GET',
        headers: {'Content-Type': 'application/json'},
    });
  }

  export function deletePost(postId, postType) {
    return fetch('/post', {
        method: 'DELETE',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({postId, postType})
    });
  }

  export function getFeed(eventIds, postIds, isProfile, take, username, hasPosts, hasEvents, feedType) {
    return fetch('/post/feed?' + new URLSearchParams({eventIds, postIds, isProfile, take, username, hasPosts, hasEvents, feedType}), {
        method: 'GET',
        headers: {'Content-Type': 'application/json'},
    });
  }
export function makeComment(text, postId) {
    return fetch('/comment/make', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({text, postId})
    });
  }

  export function getComments(postId, take, skip) {
    return fetch('/comment', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({postId, take, skip})
    });
  }

  export function likeComment(commentId) {
    return fetch('/comment/like', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({commentId})
    });
  }

  export function getCommentLikes(commentId, skip, take) {
    return fetch('/comment/getLikes', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({commentId, take, skip})
    });
  }
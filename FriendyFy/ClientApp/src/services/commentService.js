export function makeComment(text, postId, postType) {
    return fetch('/comment/make', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({text, postId, postType})
    });
  }

  export function getComments(postId, take, skip, postType) {
    return fetch('/comment', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({postId, take, skip, postType})
    });
  }

  export function likeComment(commentId, postType) {
    return fetch('/comment/like', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({commentId, postType})
    });
  }

  export function getCommentLikes(commentId, skip, take) {
    return fetch('/comment/getLikes', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({commentId, take, skip})
    });
  }

  export function deleteComment(commentId, postType) {
    return fetch('/comment/deleteComment', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({commentId, postType})
    });
  }


  
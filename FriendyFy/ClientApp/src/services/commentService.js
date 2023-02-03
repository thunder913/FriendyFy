export function makeComment(text, postId, postType) {
    return fetch('/comment', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({text, postId, postType})
    });
  }

  export function getComments(postId, take, skip, postType) {
    return fetch('/comment?' + new URLSearchParams({postId, take, skip, postType}) , {
        method: 'GET',
        headers: {'Content-Type': 'application/json'},
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
    return fetch('/comment/likes?' + new URLSearchParams({commentId, skip, take}), {
        method: 'GET',
        headers: {'Content-Type': 'application/json'},
    });
  }

  export function deleteComment(commentId, postType) {
    return fetch('/comment/deleteComment', {
        method: 'DELETE',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({commentId, postType})
    });
  }


  
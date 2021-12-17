import { getComments, makeComment } from "./commentService";
import { likePost } from "./postService";
import { likeEvent } from "./eventService";
import NotificationManager from "react-notifications/lib/NotificationManager";
export function loadMoreComments(postId, skip, postType, setComments, setHasMore) {
    return getComments(postId, 10, skip, postType)
        .then(async res => {
            let obj = await res.json();
            if (obj.length > 0) {
                setComments(prevState => ([...prevState, ...obj]));
            }
            if (obj.length < 10) {
                setHasMore(false);
            }
        })
}

export function addComment(commentRef, postId, postType, setComments, setCommentsCount, scrollRef) {
    if (commentRef.current.value) {
        makeComment(commentRef.current.value, postId, postType)
            .then(async res => {
                if (res.status === 200) {
                    commentRef.current.value = '';
                    let comment = await (res.json());
                    setComments(prevState => ([comment, ...prevState]));
                    setCommentsCount(prev => prev + 1)
                    scrollRef.current.el.scrollTop = 0;
                }else{
                    NotificationManager.error('There was an error commeting, check if you are signed in!', '', 5000);
                }
            });
    }
}

export function likedButtonClicked(postType, postId, setIsLiked, setLikes) {
    if (postType === "Post") {
        likePost(postId)
            .then(async res => {
                if (res.status === 200) {
                    setIsLiked(prev => !prev);
                    setLikes(await res.json())
                }else{
                    NotificationManager.error('There was an error liking the post, check if you are still logged in!', '', 5000);
                }
            });
    } else if (postType === "Event") {
        likeEvent(postId)
            .then(async res => {
                if (res.status === 200) {
                    setIsLiked(prev => !prev);
                    setLikes(await res.json())
                }else{
                    NotificationManager.error('There was an error liking the event, check if you are still logged in!', '', 5000);
                }
            });
    }
}
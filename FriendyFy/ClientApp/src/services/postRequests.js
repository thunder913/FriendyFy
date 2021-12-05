import { getComments, makeComment } from "./commentService";
import { likePost } from "./postService";
import { likeEvent } from "./eventService";

export function loadMoreComments(postId, skip, postType, setComments, setHasMore) {
    return getComments(postId, 10, skip, postType)
    .then(async res => { 
        let obj = await res.json();
        if(obj.length>0){
            setComments(prevState => ([...prevState, ...obj]));
        }
        else{
            setHasMore(false);
        }
    })
  }

export function addComment(commentRef, postId, postType, setComments, setCommentsCount, scrollRef){
    if(commentRef.current.value){
    makeComment(commentRef.current.value, postId, postType)
        .then(async res => 
        {
            if(res.status === 200){
            commentRef.current.value = '';
            let comment = await (res.json());
            setComments(prevState => ([comment, ...prevState]));
            setCommentsCount(prev => prev+1)
            scrollRef.current.el.scrollTop = 0;
            }
        });
    }
}

export function likedButtonClicked(postType, postId, setIsLiked, setLikes){
    if(postType === "Post"){
        likePost(postId)
        .then(async res => {if(res.status==200){
            setIsLiked(prev => !prev);
            setLikes(await res.json())
        }});    
    }else if(postType === "Event"){
        likeEvent(postId)
        .then(async res => {if(res.status==200){
            setIsLiked(prev => !prev);
            setLikes(await res.json())
        }}); 
    }
}
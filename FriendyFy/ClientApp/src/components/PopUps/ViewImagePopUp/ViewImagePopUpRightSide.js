import React, {useState, useRef, useEffect} from "react";
import { faComment, faComments, faShare, faThumbsUp } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { parseTime } from "../../../services/helperService";
import InfiniteScroll from "react-infinite-scroll-component";
import PostComment from "../../PostComment/PostComment";
import {useLoggedIn} from '../../../contexts/LoggedInContext.js'
import { getComments } from "../../../services/commentService";
import { makeComment } from "../../../services/commentService";
import { likePost } from "../../../services/postService";
import { likeEvent } from "../../../services/eventService";
import $ from 'jquery';
import '../../FeedFooter/FeedFooter.css'
const ViewImagePopUpRightSide = ({post}) => {
    const [isLiked, setIsLiked] = useState(post.isLikedByUser);
    const [hasMore, setHasMore] = useState(true);
    const {loggedIn} = useLoggedIn();
    const [comments, setComments] = useState([]);
    const [likes, setLikes] = useState(post.likesCount);
    const [commentsCount, setCommentsCount] = useState(post.commentsCount)
    const scrollRef = useRef();
    const commentRef = useRef()

    const loadMoreComments = () => {
        return getComments(post.postId, 10, comments.length, post.postType)
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

    const addComment = (e) => {
        e.preventDefault();
        makeComment(commentRef.current.value, post.postId, post.postType)
            .then(async res => 
            {
                commentRef.current.value = '';
                let comment = await (res.json());
                setComments(prevState => ([comment, ...prevState]));
                setCommentsCount(prev => prev+1)
                scrollRef.current.el.scrollTop = 0;
            });
    }

    const likeButtonClickEvent = () => {
        if(post.postType === "Post"){
            likePost(post.postId)
            .then(async res => {if(res.status==200){
                setIsLiked(prev => !prev);
                setLikes(await res.json())
            }});    
        }else if(post.postType === "Event"){
            likeEvent(post.postId)
            .then(async res => {if(res.status==200){
                setIsLiked(prev => !prev);
                setLikes(await res.json())
            }}); 
        }
    }
    
    useEffect(() => {
        getComments(post.postId, 10, 0, post.postType) 
            .then(async res => {
                let obj = await (res.json());
                if(obj.length>0){
                    setComments(obj);
                }
                else{
                    setHasMore(false);
                }
        })
    }, []) 

    useEffect(() => {
        if(commentRef.current){
            let textarea = commentRef.current;
            textarea.addEventListener('input', autoResize, false);
            $(textarea).keypress(function (e){
                if(e.which === 13 && !e.shiftKey) {
                    addComment(e);
                }
            })
            function autoResize() {
                this.style.height = 'auto';
                this.style.height = this.scrollHeight + 'px';
            }
        }

    },[commentRef])

    return (<div className="right-side">
    <div className="posted-by">
        <div className="image">
            <img src={post.creatorImage} alt="" />
        </div>
        <span>{post.creatorName}</span>
    </div>
    <p className="description">{post.postMessage}</p>
    <p className="publshed-date">{parseTime(post.createdAgo)}</p>
    <div className="likes-comments">
        <span>{likes} likes</span>
        <span>{commentsCount} comments</span>
    </div>
    <div className="actions-footer">
        <div className={"like " + (isLiked ? "liked" : "")} onClick={likeButtonClickEvent}>
        <FontAwesomeIcon className="post-button like-button" icon={faThumbsUp} />
            <span>Like</span>
        </div>
        <div className={"comment"}>
            <FontAwesomeIcon className="post-button like-button" icon={faComments} />
            <span>Comment</span>
        </div>
        <div className="repost">
            <FontAwesomeIcon className="post-button like-button" icon={faShare} />
            <span>Repost</span>
        </div>
    </div>
    <div className="feed-footer">
        <div className="comments">

    <div className={"infinite-scroll "+ (comments.length == 0 ? 'display-none' : '')}>
    <InfiniteScroll
        className={"comments-section"}
        dataLength={comments.length}
        next={loadMoreComments}
        height={900}
        // inverse={true}
        hasMore={hasMore}
        loader={<h4 className="loading-text">Loading...</h4>}
        scrollableTarget="scrollableDiv"
        endMessage={
            <p style={{ textAlign: 'center' }}>
              <b>No more comments available</b>
            </p>
          }
        ref={scrollRef}>
        {comments.map(c => <PostComment comment={c} key={c.id}/>)}
    </InfiniteScroll>
    </div>

    <div className="add-comment">
        <textarea 
            name="" 
            id="comment-text" 
            cols="30" 
            rows="1" 
            ref={commentRef}
            placeholder="What do you think?"
            />
        <FontAwesomeIcon className="comment-send" icon={faComment} onClick={addComment}/>
    </div>
    </div>
</div> 
</div>)
}
export default ViewImagePopUpRightSide;

import React, {useState, useRef, useEffect} from "react";
import { faComment, faComments, faShare, faThumbsUp } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { parseTime } from "../../../services/helperService";
import InfiniteScroll from "react-infinite-scroll-component";
import PostComment from "../../PostComment/PostComment";
import {useLoggedIn} from '../../../contexts/LoggedInContext.js'
import { getComments } from "../../../services/commentService";
import { loadMoreComments, addComment, likedButtonClicked } from "../../../services/postRequests";
import $ from 'jquery';
import '../../FeedFooter/FeedFooter.css'
const ViewImagePopUpRightSide = ({props}) => {
    const post = props.post;

    const [hasMore, setHasMore] = useState(true);
    const {loggedIn} = useLoggedIn();
    const scrollRef = useRef();
    const commentRef = useRef()

    const loadMoreCommentsEvent = () => {
        return loadMoreComments(post.postId, props.comments.length, post.postType, props.setComments, setHasMore);
    }

    const addCommentEvent = (e) => {
        e.preventDefault();
        addComment(commentRef, post.postId, post.postType, props.setComments, props.setCommentsCount, scrollRef);
    }

    const likeButtonClickEvent = () => {
        likedButtonClicked(post.postType, post.postId, props.setIsLiked, props.setLikes);
    }
    
    useEffect(() => {
        if(post){
        getComments(post.postId, 10, 0, post.postType) 
            .then(async res => {
                let obj = await (res.json());
                if(obj.length>0){
                    props.setComments(obj);
                }
                else{
                    setHasMore(false);
                }
        })
        }
    }, [post]) 

    useEffect(() => {
        if(commentRef.current){
            let textarea = commentRef.current;
            textarea.addEventListener('input', autoResize, false);
            $(textarea).keypress(function (e){
                if(e.which === 13 && !e.shiftKey) {
                    addCommentEvent(e);
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
        <span>{props.likes} likes</span>
        <span>{props.commentsCount} comments</span>
    </div>
    <div className="actions-footer">
        <div className={"like " + (props.isLiked ? "liked" : "")} onClick={likeButtonClickEvent}>
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

    <div className={"infinite-scroll "+ (props.comments.length == 0 ? 'display-none' : '')}>
    <InfiniteScroll
        className={"comments-section"}
        dataLength={props.comments.length}
        next={loadMoreCommentsEvent}
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
        {props.comments.map(c => <PostComment comment={c} key={c.id}/>)}
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
        <FontAwesomeIcon className="comment-send" icon={faComment} onClick={addCommentEvent}/>
    </div>
    </div>
</div> 
</div>)
}
export default ViewImagePopUpRightSide;

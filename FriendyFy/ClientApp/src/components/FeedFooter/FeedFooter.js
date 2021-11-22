import React, {useState, useRef, useEffect} from 'react';
import './FeedFooter.css';
import { faComment, faComments, faShare, faThumbsUp } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { getPostLikes, likePost } from '../../services/postService';
import $ from 'jquery';
import { getComments, makeComment } from '../../services/commentService';
import PostComment from '../PostComment/PostComment';
import PeopleListPopUp from '../PeopleListPopUp/PeopleListPopUp'
import InfiniteScroll from 'react-infinite-scroll-component';
import useScrollBlock from "../../hooks/useScrollBlock";

const FeedFooter = (props) => {
    const [isLiked, setIsLiked] = useState(props.isLiked);
    const [likes, setLikes] = useState(props.likes)
    const [showComments, setShowComments] = useState(false);
    const [comments, setComments] = useState([]);
    const [showPeopleLiked, setShowPeopleLiked] = useState(false)
    const [commentsCount, setCommentsCount] = useState(props.comments);
    const [hasMore, setHasMore] = useState(true);
    const commentRef = useRef()
    const scrollRef = useRef();
    const [blockScroll, allowScroll] = useScrollBlock();

    const closePopUp = () => {
        allowScroll();
        setShowPeopleLiked(false);
    }

    const loadLikes = (skip) => {
        return getPostLikes(props.postId, skip, 10);
    }

    const likeButtonClickEvent = () => {
        likePost(props.postId)
            .then(async res => {if(res.status==200){
                setIsLiked(prev => !prev);
                setLikes(await res.json())
            }});    
    }

    const showPeopleLikes = () => {
        setShowPeopleLiked(true);
        blockScroll();
    }

    const showCommentsClickEvent = () => {
        setShowComments(prev => !prev);
    }

    const addComment = (e) => {
        e.preventDefault();
        makeComment(commentRef.current.value, props.postId)
            .then(async res => 
            {
                commentRef.current.value = '';
                let comment = await (res.json());
                setComments(prevState => ([comment, ...prevState]));
                setCommentsCount(prev => prev+1)
                scrollRef.current.el.scrollTop = 0;
            });
    }

    const loadMoreComments = () => {
        return getComments(props.postId, 10, comments.length)
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

    },[showComments, commentRef])

    useEffect(() => {
        if(showComments){
            getComments(props.postId, 10, 0) 
                .then(async res => {
                    let obj = await (res.json());
                    if(obj.length>0){
                        setComments(obj);
                    }
                    else{
                        setHasMore(false);
                    }
            })
        }
    }, [showComments]) 

return(
<footer className="feed-footer">
            <div className="top-footer">
                <div className="likes">
                    {showPeopleLiked ? 
                            <PeopleListPopUp 
                                title="Likes"
                                count={likes}
                                loadPeople={loadLikes}
                                closePopUp={closePopUp}
                            /> : ''}
                    <span>
                        <button onClick={showPeopleLikes} href="/">
                            {likes} likes
                        </button>
                    </span>
                </div>
                <div className="comments-reposts">
                    <span>
                        <button onClick={showCommentsClickEvent}>
                            {commentsCount} comments
                        </button>
                    </span>
                    <span>
                        <button>
                            {props.reposts} reposts
                        </button>
                    </span>
                </div>
            </div>
            
            {showComments ? 
            <div className="comments">
                <div className={"infinite-scroll "+ (comments.length == 0 ? 'display-none' : '')}>
                <InfiniteScroll
                    className={"comments-section"}
                    dataLength={comments.length}
                    next={loadMoreComments}
                    height={300}
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
            : ""}
            {/* Make the comments show here */}
            <div className="bottom-footer">
                <div className={"feed-like " + (isLiked ? "liked" : "")} onClick={likeButtonClickEvent}>
                <FontAwesomeIcon className="post-button like-button" icon={faThumbsUp} />
                    <span>Like</span>
                </div>
                <div className={"feed-comment " + (showComments ? "opened-comments" : "")} onClick={showCommentsClickEvent}>
                    <FontAwesomeIcon className="post-button like-button" icon={faComments} />
                    <span>Comment</span>
                </div>
                <div className="feed-repost">
                    <FontAwesomeIcon className="post-button like-button" icon={faShare} />
                    <span>Repost</span>
                </div>
            </div>
        </footer>)
}

export default FeedFooter;

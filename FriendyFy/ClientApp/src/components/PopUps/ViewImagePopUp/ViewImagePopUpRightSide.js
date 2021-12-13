import React, { useState, useRef, useEffect } from "react";
import { faComment, faComments, faShare, faThumbsUp } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { parseTime } from "../../../services/helperService";
import InfiniteScroll from "react-infinite-scroll-component";
import PostComment from "../../PostComment/PostComment";
import { deleteComment, getComments } from "../../../services/commentService";
import { loadMoreComments, addComment, likedButtonClicked } from "../../../services/postRequests";
import $ from 'jquery';
import '../../FeedFooter/FeedFooter.css'
import RepostPopUp from "../RepostPopUp/RepostPopUp";
import Loader from "react-loader-spinner";

const ViewImagePopUpRightSide = ({comments, setComments, setCommentsCount, setIsLiked, isLiked, commentsCount, setLikes, likes, post}) => {
    const [hasMore, setHasMore] = useState(true);
    const [showRepostPopUp, setShowRepostPopUp] = useState(false);
    const scrollRef = useRef();
    const commentRef = useRef()

    const deleteCommentEvent = (commentId, postType) => {
        deleteComment(commentId, postType)
            .then(res => {
                if(res.status === 200){
                    let element = comments.find(x => x.id === commentId);
                    let index = comments.indexOf(element);
            
                    let array = [...comments];
                    array.splice(index, 1);
                    setComments(array);
                    setCommentsCount(prev => prev-1)
                }else{
                    console.log("ERROR");
                }
            })
    }

    const loadMoreCommentsEvent = () => {
        return loadMoreComments(post.postId, comments.length, post.postType, setComments, setHasMore);
    }

    const addCommentEvent = (e) => {
        e.preventDefault();
        addComment(commentRef, post.postId, post.postType, setComments, setCommentsCount, scrollRef);
    }

    const likeButtonClickEvent = () => {
        likedButtonClicked(post.postType, post.postId, setIsLiked, setLikes);
    }

    const focusCommentInput = () => {
        commentRef.current.focus();
    }

    useEffect(() => {
        if (post) {
            getComments(post.postId, 10, 0, post.postType)
                .then(async res => {
                    let obj = await (res.json());
                    if (obj.length > 0) {
                        setComments(obj);
                    }
                    else {
                        setHasMore(false);
                    }
                })
        }
    }, [post])

    useEffect(() => {
        if (commentRef.current) {
            let textarea = commentRef.current;
            textarea.addEventListener('input', autoResize, false);
            $(textarea).keypress(function (e) {
                if (e.which === 13 && !e.shiftKey) {
                    addCommentEvent(e);
                }
            })
            function autoResize() {
                this.style.height = 'auto';
                this.style.height = this.scrollHeight + 'px';
            }
        }

    }, [commentRef])

    return (<div className="right-side">
        <RepostPopUp manyPopUps={true} repostType={post.postType} id={post.postId} show={showRepostPopUp} setShow={setShowRepostPopUp} />
        <div className="posted-by">
            <div className="image">
                <img src={post.creatorImage} alt="" />
            </div>
            <span>{post.creatorName}</span>
        </div>
        <p className="description">{post.postMessage}</p>
        <p className="publshed-date">{parseTime(post.createdAgo)}</p>
        <div className="likes-comments">
            <span>{likes} like{likes === 1 ? '' : 's'}</span>
            <span>{commentsCount} comment{commentsCount === 1 ? '' : 's'}</span>
        </div>
        <div className="actions-footer">
            <div className={"like " + (isLiked ? "liked" : "")} onClick={likeButtonClickEvent}>
                <FontAwesomeIcon className="post-button like-button" icon={faThumbsUp} />
                <span>Like</span>
            </div>
            <div className={"comment"} onClick={focusCommentInput}>
                <FontAwesomeIcon className="post-button like-button" icon={faComments} />
                <span>Comment</span>
            </div>
            <div className="repost" onClick={() => setShowRepostPopUp(true)}>
                <FontAwesomeIcon className="post-button like-button" icon={faShare} />
                <span>Repost</span>
            </div>
        </div>
        <div className="feed-footer">
            <div className="comments">

                <div className={"infinite-scroll"}>
                    <InfiniteScroll
                        className={"comments-section"}
                        dataLength={comments.length}
                        next={loadMoreCommentsEvent}
                        height={900}
                        hasMore={hasMore}
                        loader={<Loader
                            type="TailSpin"
                            color="#50A6FA"
                            height={100}
                            width={100}
                            className="loader"
                          />}
                        scrollableTarget="scrollableDiv"
                        endMessage={
                            <p style={{ textAlign: 'center' }}>
                                <b>No {comments.length ? 'more ' : ''}comments available</b>
                            </p>
                        }
                        ref={scrollRef}>
                        {comments.map(c => <PostComment deleteCommentEvent={deleteCommentEvent} manyPopUps={true} comment={c} key={c.id} />)}
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
                    <FontAwesomeIcon className="comment-send" icon={faComment} onClick={addCommentEvent} />
                </div>
            </div>
        </div>
    </div>)
}
export default ViewImagePopUpRightSide;

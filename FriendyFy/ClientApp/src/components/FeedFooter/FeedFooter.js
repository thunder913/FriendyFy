import React, { useState, useRef, useEffect } from 'react';
import './FeedFooter.css';
import { faComment, faComments, faShare, faThumbsUp } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { getPostLikes, getPostReposts, likePost } from '../../services/postService';
import $ from 'jquery';
import { deleteComment, getComments, makeComment } from '../../services/commentService';
import PostComment from '../PostComment/PostComment';
import PeopleListPopUp from '../PopUps/PeopleListPopUp/PeopleListPopUp'
import InfiniteScroll from 'react-infinite-scroll-component';
import { likeEvent } from '../../services/eventService';
import { loadMoreComments, addComment, likedButtonClicked } from '../../services/postRequests';
import { repost } from '../../services/postService';
import RepostPopUp from '../PopUps/RepostPopUp/RepostPopUp';
import Loader from 'react-loader-spinner';

const FeedFooter = (props) => {
    const [showComments, setShowComments] = useState(false);
    const [showPeopleLiked, setShowPeopleLiked] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [showRepostPopUp, setShowRepostPopUp] = useState(false);
    const [showPeopleReposts, setShowPeopleReposts] = useState(false);
    const commentRef = useRef()
    const scrollRef = useRef();

    const loadLikes = (skip) => {
        return getPostLikes(props.postId, props.postType, skip, 10);
    }

    const likeButtonClickEvent = () => {
        likedButtonClicked(props.postType, props.postId, props.setIsLiked, props.setLikes);
    }

    const showCommentsClickEvent = () => {
        setShowComments(prev => !prev);
    }

    const addCommentEvent = (e) => {
        e.preventDefault();
        addComment(commentRef, props.postId, props.postType, props.setComments, props.setCommentsCount, scrollRef);
    }

    const loadMoreCommentsEvent = () => {
        return loadMoreComments(props.postId, props.comments.length, props.postType, props.setComments, setHasMore);
    }

    const loadReposts = (skip) => {
        return getPostReposts(props.postId, props.postType, skip, 10);
    }

    const deleteCommentEvent = (commentId, postType) => {
        deleteComment(commentId, postType)
            .then(res => {
                if(res.status === 200){
                    let element = props.comments.find(x => x.id === commentId);
                    let index = props.comments.indexOf(element);
            
                    let array = [...props.comments];
                    array.splice(index, 1);
                    props.setComments(array);
                    props.setCommentsCount(prev => prev-1)
                }else{
                    console.log("ERROR");
                }
            })
    }

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

    }, [showComments, commentRef])

    useEffect(() => {
        if (showComments) {
            getComments(props.postId, 10, props.comments.length, props.postType)
                .then(async res => {
                    let obj = await (res.json());
                    if (obj.length > 0) {
                        props.setComments(prevState => ([...prevState, ...obj]));
                    }
                    if(obj.length < 10) {
                        setHasMore(false);
                    }
                })
        }
    }, [showComments])

    return (
        <footer className="feed-footer">
            <div className="top-footer">
                <div className="likes">
                    <RepostPopUp repostType={props.postType} id={props.repostId} show={showRepostPopUp} setShow={setShowRepostPopUp} />
                    <PeopleListPopUp
                        title="Likes"
                        count={props.likes}
                        loadPeople={loadLikes}
                        show={showPeopleLiked}
                        setShow={setShowPeopleLiked} />
                    <PeopleListPopUp
                        title="Reposts"
                        count={props.reposts}
                        loadPeople={loadReposts}
                        show={showPeopleReposts}
                        setShow={setShowPeopleReposts}
                    />
                    <span>
                        <button onClick={() => setShowPeopleLiked(true)} href="/">
                            {props.likes} likes
                        </button>
                    </span>
                </div>
                <div className="comments-reposts">
                    <span>
                        <button onClick={showCommentsClickEvent}>
                            {props.commentsCount} comments
                        </button>
                    </span>
                    <span>
                        {!props.isRepost ? <button onClick={() => setShowPeopleReposts(true)}>
                            {props.reposts} reposts
                        </button> : ''}
                    </span>
                </div>
            </div>

            {showComments ?
                <div className="comments">
                    <div className={"infinite-scroll"}>
                        <InfiniteScroll
                            className={"comments-section"}
                            dataLength={props.comments.length}
                            next={loadMoreCommentsEvent}
                            height={300}
                            // inverse={true}
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
                                    <b>No {props.comments.length ? 'more ' : ''}comments available</b>
                                </p>
                            }
                            ref={scrollRef}>
                            {props.comments.map(c => <PostComment deleteCommentEvent={deleteCommentEvent} comment={c} key={c.id} />)}
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
                : ""}
            <div className="bottom-footer">
                <div className={"feed-like " + (props.isLiked ? "liked" : "")} onClick={likeButtonClickEvent}>
                    <FontAwesomeIcon className="post-button like-button" icon={faThumbsUp} />
                    <span>Like</span>
                </div>
                <div className={"feed-comment " + (showComments ? "opened-comments" : "")} onClick={showCommentsClickEvent}>
                    <FontAwesomeIcon className="post-button like-button" icon={faComments} />
                    <span>Comment</span>
                </div>
                <div className="feed-repost" onClick={() => setShowRepostPopUp(true)}>
                    <FontAwesomeIcon className="post-button like-button" icon={faShare} />
                    <span>Repost</span>
                </div>
            </div>
        </footer>)
}

export default FeedFooter;

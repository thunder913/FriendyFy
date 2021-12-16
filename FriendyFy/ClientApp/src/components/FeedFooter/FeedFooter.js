import React, { useState, useRef, useEffect } from 'react';
import './FeedFooter.css';
import { faComment, faComments, faShare, faThumbsUp } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { getPostLikes, getPostReposts } from '../../services/postService';
import $ from 'jquery';
import { deleteComment, getComments } from '../../services/commentService';
import PostComment from '../PostComment/PostComment';
import PeopleListPopUp from '../PopUps/PeopleListPopUp/PeopleListPopUp'
import InfiniteScroll from 'react-infinite-scroll-component';
import { loadMoreComments, addComment, likedButtonClicked } from '../../services/postRequests';
import RepostPopUp from '../PopUps/RepostPopUp/RepostPopUp';
import Loader from 'react-loader-spinner';
import { NotificationManager } from 'react-notifications';

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
                if (res.status === 200) {
                    let element = props.comments.find(x => x.id === commentId);
                    let index = props.comments.indexOf(element);

                    let array = [...props.comments];
                    array.splice(index, 1);
                    props.setComments(array);
                    props.setCommentsCount(prev => prev - 1)
                } else {
                    NotificationManager.error('There was an error deleting the comment!', '', 4000)
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
        //eslint-disable-next-line
    }, [showComments, commentRef])

    useEffect(() => {
        if (showComments) {
            getComments(props.postId, 10, props.comments.length, props.postType)
                .then(async res => {
                    let obj = await (res.json());
                    if (obj.length > 0) {
                        props.setComments(prevState => ([...prevState, ...obj]));
                    }
                    if (obj.length < 10) {
                        setHasMore(false);
                    }
                })
        }
        //eslint-disable-next-line
    }, [showComments])

    return (
        <footer className="feed-footer">
            <div className="top-footer">
                <div className="likes">
                    <RepostPopUp repostType={props.postType} id={props.repostId} show={showRepostPopUp} setShow={setShowRepostPopUp} setRepostsCount={props.setReposts} />
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
                            {props.likes} like{props.likes === 1 ? '' : 's'}
                        </button>
                    </span>
                </div>
                <div className="comments-reposts">
                    <span>
                        <button onClick={showCommentsClickEvent}>
                            {props.commentsCount} comment{props.commentsCount === 1 ? '' : 's'}
                        </button>
                    </span>
                    <span>
                        {!props.isRepost ? <button onClick={() => setShowPeopleReposts(true)}>
                            {props.reposts} repost{props.reposts === 1 ? '' : 's'}
                        </button> : ''}
                    </span>
                </div>
            </div>

            {showComments ?
                <div className="comments">
                    <div className={"infinite-scroll"}>
                        <InfiniteScroll
                            className={"comments-section fancy-scroll"}
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

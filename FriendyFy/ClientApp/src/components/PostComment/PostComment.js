import React, { useState } from "react";
import { parseTime } from '../../services/helperService';
import { faThumbsUp } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { likeComment } from "../../services/commentService";
import "./PostComment.css"
import PeopleListPopUp from '../PopUps/PeopleListPopUp/PeopleListPopUp';
import { getCommentLikes } from "../../services/commentService";
import { Link } from 'react-router-dom'

const PostComment = ({comment}) => {
    const [likedByYou, setLikedByYou] = useState(comment.isLikedByUser);
    const [likesCount, setLikesCount] = useState(comment.likesCount)
    const [showPeopleLikesPopUp, setShowPeopleLikesPopUp] = useState(false);

    const loadLikes = (skip) => {
        return getCommentLikes(comment.id, skip, 10);
    }
    
    const commentLikeEvent = (e) => {
        e.preventDefault();
        likeComment(comment.id, comment.postType)
            .then(async res => 
                {
                    setLikedByYou(prev => !prev)
                    setLikesCount(await res.json())
                });
    }

    return (<div key={comment.id} className="comment">
                            <PeopleListPopUp 
                                title="Likes"
                                count={likesCount}
                                loadPeople={loadLikes}
                                show={showPeopleLikesPopUp}
                                setShow={setShowPeopleLikesPopUp}
                                manyPopUps={true}
                            />
                    <Link to={'/profile/' + comment.commentorUsername}>
                        <div className="user-picture">
                            <img src={comment.commentorPicture} alt="" />
                        </div>
                    </Link>
                    <div className="inner-comment">
                    <Link to={'/profile/' + comment.commentorUsername}>
                        <div className="top-comment-half">
                            {comment.commentorName}
                        </div>
                    </Link>
                    <p>{comment.commentText}</p>
                    <footer className="comment-footer">
                        <button className={likedByYou ? 'liked' : ''} onClick={commentLikeEvent}>Like</button>
                        <p>{parseTime(comment.createdAgo)}</p>
                        {likesCount > 0 ? 
                        <div className="comment-likes" onClick={() => setShowPeopleLikesPopUp(true)}>
                        <FontAwesomeIcon className="comment-like-button" icon={faThumbsUp} />
                        <p className="comment-likes-count">{likesCount}</p></div> : ''}
                    </footer>
                    </div>
                </div>)
}

export default PostComment;
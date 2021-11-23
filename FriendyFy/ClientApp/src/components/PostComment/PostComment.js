import React, { useState } from "react";
import { parseTime } from '../../services/helperService';
import { faThumbsUp } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { likeComment } from "../../services/commentService";
import { useHistory } from 'react-router';
import "./PostComment.css"
import PeopleListPopUp from '../PeopleListPopUp/PeopleListPopUp';
import { getCommentLikes } from "../../services/commentService";
const PostComment = ({comment}) => {
    const [likedByYou, setLikedByYou] = useState(comment.isLikedByUser);
    const [likesCount, setLikesCount] = useState(comment.likesCount)
    const [showPeopleLikesPopUp, setShowPeopleLiekdPopUp] = useState(false);
    const history = useHistory();

    const loadLikes = (skip) => {
        return getCommentLikes(comment.id, skip, 10);
    }
    
    const showPeopleLikes = () => {
        setShowPeopleLiekdPopUp(true);
    }
    
    const closePopUp = () => {
        setShowPeopleLiekdPopUp(false);
    }
    const commentLikeEvent = (e) => {
        e.preventDefault();
        likeComment(comment.id)
            .then(async res => 
                {
                    setLikedByYou(prev => !prev)
                    setLikesCount(await res.json())
                });
    }

    const redirectToUserProfile = () => {
        history.push('/profile/' + comment.commentorUsername);
    }

    return (<div key={comment.id} className="comment">
                                {showPeopleLikesPopUp ? 
                            <PeopleListPopUp 
                                title="Likes"
                                count={likesCount}
                                loadPeople={loadLikes}
                                closePopUp={closePopUp}
                            /> : ''}
                    <div className="user-picture" onClick={redirectToUserProfile}>
                        <img src={comment.commentorPicture} alt="" />
                    </div>
                    <div className="inner-comment">
                        <div className="top-comment-half" onClick={redirectToUserProfile}>
                            {comment.commentorName}
                        </div>
                    <p>{comment.commentText}</p>
                    <footer className="comment-footer">
                        <button className={likedByYou ? 'liked' : ''} onClick={commentLikeEvent}>Like</button>
                        <p>{parseTime(comment.createdAgo)}</p>
                        {likesCount > 0 ? 
                        <div className="comment-likes" onClick={showPeopleLikes}>
                        <FontAwesomeIcon className="comment-like-button" icon={faThumbsUp} />
                        <p className="comment-likes-count">{likesCount}</p></div> : ''}
                    </footer>
                    </div>
                </div>)
}

export default PostComment;
import React, { useState } from "react";
import { parseTime } from '../../services/helperService';
import { faThumbsUp } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { likeComment } from "../../services/commentService";
import { useHistory } from 'react-router';
import "./PostComment.css"
const PostComment = ({comment}) => {
    const [likedByYou, setLikedByYou] = useState(comment.isLikedByUser);
    const [likesCount, setLikesCount] = useState(comment.likesCount)
    const history = useHistory();
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
                        <div className="comment-likes">
                        <FontAwesomeIcon className="comment-like-button" icon={faThumbsUp} />
                        <p className="comment-likes-count">{likesCount}</p></div> : ''}
                    </footer>
                    </div>
                </div>)
}

export default PostComment;
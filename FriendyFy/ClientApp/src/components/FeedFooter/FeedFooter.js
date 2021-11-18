import React, {useState} from 'react';
import './FeedFooter.css';
import { faComments, faShare, faThumbsUp } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { likePost } from '../../services/postService';

const FeedFooter = (props) => {
    const [isLiked, setIsLiked] = useState(props.isLiked);
    const [likes, setLikes] = useState(props.likes)
    const [showComments, setShowComments] = useState(false);
    const likeButtonClickEvent = () => {
        likePost(props.postId)
            .then(async res => {if(res.status==200){
                setIsLiked(prev => !prev);
                setLikes(await res.json())
            }});    
    }

    const showCommentsClickEvent = () => {
        console.log(showComments)
        setShowComments(prev => !prev);
    }

return(
<footer className="feed-footer">
            <div className="top-footer">
                <div className="likes">
                    <span>
                        <a href="/">
                            {likes} likes
                        </a>
                    </span>
                </div>
                <div className="comments-reposts">
                    <span>
                        <a href="/">
                            {props.comments} comments
                        </a>
                    </span>
                    <span>
                        <a href="/">
                            {props.reposts} reposts
                        </a>
                    </span>
                </div>
            </div>
            <div className="comments-section">
            <div className="comment">
                    <div className="user-picture">
                        <img src="https://friendyfy.blob.core.windows.net/pictures/ba8b368f-e711-44dd-b611-41cdbf36fb3c.jpeg" alt="" />
                    </div>
                    <div className="inner-comment">
                        <div className="top-comment-half">
                            Ivailo Gerenski
                        </div>
                    <p>I have commented on your post!</p>
                    <footer className="comment-footer">
                        <button>Like</button>
                        <button>Reply</button>
                        <p>23h ago</p>
                    </footer>
                    </div>
                </div>
                <div className="comment">
                    <div className="user-picture">
                        <img src="https://friendyfy.blob.core.windows.net/pictures/ba8b368f-e711-44dd-b611-41cdbf36fb3c.jpeg" alt="" />
                    </div>
                    <div className="inner-comment">
                        <div className="top-comment-half">
                            Ivailo Gerenski
                        </div>
                    <p>I have commented on your post!I have commented on your post!I have commented on your post!I have commented on your post!I have commented on your post!I have commented on your post!I have commented on your post!</p>
                    </div>
                </div>
                <div className="comment">
                    <div className="user-picture">
                        <img src="https://friendyfy.blob.core.windows.net/pictures/ba8b368f-e711-44dd-b611-41cdbf36fb3c.jpeg" alt="" />
                    </div>
                    <div className="inner-comment">
                        <div className="top-comment-half">
                            Ivailo Gerenski
                        </div>
                    <p>I have commented on your post!</p>
                    </div>
                </div>
                <div className="comment">
                    <div className="user-picture">
                        <img src="https://friendyfy.blob.core.windows.net/pictures/ba8b368f-e711-44dd-b611-41cdbf36fb3c.jpeg" alt="" />
                    </div>
                    <div className="inner-comment">
                        <div className="top-comment-half">
                            Ivailo Gerenski
                        </div>
                    <p>I have commented on your post!</p>
                    </div>
                </div>
                <div className="comment">
                    <div className="user-picture">
                        <img src="https://friendyfy.blob.core.windows.net/pictures/ba8b368f-e711-44dd-b611-41cdbf36fb3c.jpeg" alt="" />
                    </div>
                    <div className="inner-comment">
                        <div className="top-comment-half">
                            Ivailo Gerenski
                        </div>
                    <p>I have commented on your post!I have commented on your post!I have commented on your post!I have commented on your post!I have commented on your post!</p>
                    </div>
                </div>
            </div>
            {showComments ? "COMMENTS!" : ""}
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

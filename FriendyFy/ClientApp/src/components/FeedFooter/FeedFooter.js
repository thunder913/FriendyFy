import React, {useState} from 'react';
import './FeedFooter.css';
import { faComments, faShare, faThumbsUp } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { likePost } from '../../services/postService';

const FeedFooter = (props) => {
    const [isLiked, setIsLiked] = useState(props.isLiked);
    const [likes, setLikes] = useState(props.likes)

    const likeButtonClickEvent = () => {
        likePost(props.postId)
            .then(async res => {if(res.status==200){
                setIsLiked(prev => !prev);
                setLikes(await res.json())
            }});    
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
            <div className="bottom-footer">
                <div className={"feed-like " + (isLiked ? "liked" : "")} onClick={likeButtonClickEvent}>
                <FontAwesomeIcon className="post-button like-button" icon={faThumbsUp} />
                    <span>Like</span>
                </div>
                <div className="feed-comment">
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

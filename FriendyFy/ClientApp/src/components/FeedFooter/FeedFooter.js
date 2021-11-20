import React, {useState, useRef, useEffect} from 'react';
import './FeedFooter.css';
import { faComment, faComments, faShare, faThumbsUp } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { likePost } from '../../services/postService';
import $ from 'jquery';
import { getComments, makeComment } from '../../services/commentService';
import PostComment from '../PostComment/PostComment';
const FeedFooter = (props) => {
    const [isLiked, setIsLiked] = useState(props.isLiked);
    const [likes, setLikes] = useState(props.likes)
    const [showComments, setShowComments] = useState(false);
    const [comments, setComments] = useState([]);
    const commentRef = useRef()

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

    const addComment = (e) => {
        e.preventDefault();
        makeComment(commentRef.current.value, props.postId)
            .then(async res => 
            {
                commentRef.current.value = '';
                let comment = await (res.json());
                setComments(prevState => ([...prevState, comment]));
            });
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
                .then(async res => setComments(await (res.json())))
        }

    }, [showComments])

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
                        <button onClick={showCommentsClickEvent}>
                            {props.comments} comments
                        </button>
                    </span>
                    <span>
                        <a href="/">
                            {props.reposts} reposts
                        </a>
                    </span>
                </div>
            </div>
            
            {showComments ? 
            <div className="comments">
            <div className="comments-section">
                {comments.map(c => 
                <PostComment comment={c} key={c.id}/>)}
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
            </div> : ""}
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

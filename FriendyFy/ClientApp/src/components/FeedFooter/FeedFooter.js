import React from 'react';
import './FeedFooter.css';
import { faComments, faShare, faThumbsUp } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const FeedFooter = (props) => (
<footer className="feed-footer">
            <div className="top-footer">
                <div className="likes">
                    <span>
                        <a href="">
                            {props.likes} likes
                        </a>
                    </span>
                </div>
                <div className="comments-reposts">
                    <span>
                        <a href="">
                            {props.comments} comments
                        </a>
                    </span>
                    <span>
                        <a href="">
                            {props.reposts} reposts
                        </a>
                    </span>
                </div>
            </div>
            <div className="bottom-footer">
                <div className="feed-like">
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
        </footer>
)

export default FeedFooter;

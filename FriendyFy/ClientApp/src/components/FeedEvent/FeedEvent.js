import React from 'react';
import './FeedEvent.css';
import { faComments, faEllipsisH, faShare, faThumbsUp } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import FeedHeader from '../FeedHeader/FeedHeader';

const FeedEvent = ({ event }) => (
    <div className="feed feed-event" >
        <FeedHeader photo="https://tinyurl.com/44t28uud" name="Andon Gorchov" time="37m"/>
        <div className="event-images">
            {event.attending.map((user) => <div className="user-photo">
                <img src={user.photo} alt="" />
            </div>)}
        </div>
        <div className="second-row">
            <h2>{event.name}</h2>
            <button className="join">Join</button>
        </div>
        <div className="interests">
            {event.interests.map(interest => <div className="interest">{interest}</div>)}
        </div>
        <div className="third-row">
            <span>Location: {event.location}</span>
            <span>{event.time}</span>
        </div>
        <footer className="feed-footer">
            <div className="top-footer">
                <div className="likes">
                    <span>
                        <a href="">
                            49 likes
                        </a>
                    </span>
                </div>
                <div className="comments-reposts">
                    <span>
                        <a href="">
                            33 comments
                        </a>
                    </span>
                    <span>
                        <a href="">
                            12 reposts
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
    </div>
)

export default FeedEvent;
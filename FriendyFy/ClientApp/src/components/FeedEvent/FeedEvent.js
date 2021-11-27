import React from 'react';
import './FeedEvent.css';
import FeedHeader from '../FeedHeader/FeedHeader';
import FeedFooter from '../FeedFooter/FeedFooter';
import { parseTime } from '../../services/helperService';
const FeedEvent = ({ event }) => (
    <div className="feed feed-event" >
        <FeedHeader 
            photo={event.creatorImage} 
            name={event.creatorName}
            time={parseTime(event.createdAgo)}
            username={event.username}
            postId={event.postId}/>
        <div className="event-images">
            {event.eventGoing.map((photo) => <div className="user-photo">
                <img src={photo} alt="" />
            </div>)}
        </div>
        <div className="second-row">
            <h2>{event.name}</h2>
            <button className="join">Join</button>
        </div>
        <div className="interests">
            {event.eventInterests.map(interest => <div key={interest.id} className="interest">{interest.label}</div>)}
        </div>
        <div className="third-row">
            <span>Location: {event.locationCity}</span>
            <span>{event.eventTime}</span>
        </div>
        <FeedFooter likes={event.likesCount} comments={event.commentsCount} reposts={event.repostsCount}/>
    </div>
)

export default FeedEvent;
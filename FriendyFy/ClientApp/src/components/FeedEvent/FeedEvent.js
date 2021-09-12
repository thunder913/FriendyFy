import React from 'react';
import './FeedEvent.css';

const FeedEvent = ({event}) => (
    <div className="feed feed-event" >
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
    </div>
)

export default FeedEvent;
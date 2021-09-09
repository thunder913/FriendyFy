import React from 'react';
import './FeedEvent.css';

const FeedEvent = ({ events }) => (
    <div className="feed feed-event" >
        {events.map((event => (<div className="event">
            <div className="event-images">
            {event.attending.map((user) => <div className="user-photo">
                <img src={user.photo} alt="" />
            </div>)}
            </div>
            <div className="second-row">
                <h2>{event.name}</h2>
                <button className="join">Join</button>
            </div>
            <div className="third-row">
                <span>Location: {event.location}</span>
                <span>Time: {event.time}</span>
            </div>
        </div>)))}
    </div>
)

export default FeedEvent;
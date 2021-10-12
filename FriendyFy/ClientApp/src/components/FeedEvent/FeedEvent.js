import React from 'react';
import './FeedEvent.css';
import FeedHeader from '../FeedHeader/FeedHeader';
import FeedFooter from '../FeedFooter/FeedFooter';

const FeedEvent = ({ event }) => (
    <div className="feed feed-event" >
        <FeedHeader photo="/static/media/testPhoto.c8119cb6.jpg" name="Andon Gorchov" time="37m"/>
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
        <FeedFooter likes="5" comments="10" reposts="20"/>
    </div>
)

export default FeedEvent;
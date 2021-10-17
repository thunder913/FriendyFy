import React from 'react';
import './FeedEvent.css';
import FeedHeader from '../FeedHeader/FeedHeader';
import FeedFooter from '../FeedFooter/FeedFooter';

const FeedEvent = ({ event }) => (
    <div className="feed feed-event" >
        <FeedHeader photo="https://scontent.fsof8-1.fna.fbcdn.net/v/t1.6435-9/194957949_4334439429940720_5542816028295677772_n.jpg?_nc_cat=108&ccb=1-5&_nc_sid=09cbfe&_nc_ohc=YeTxne8hWKoAX9bbJvR&_nc_ht=scontent.fsof8-1.fna&oh=51a6dbebf71ee668c34d7292be94abf0&oe=6192F854" name="Andon Gorchov" time="37m"/>
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
import React, { useState, useEffect } from 'react';
import './FeedEvent.css';
import FeedHeader from '../FeedHeader/FeedHeader';
import FeedFooter from '../FeedFooter/FeedFooter';
import { parseTime } from '../../services/helperService';
import { useHistory } from 'react-router';
import moment from 'moment';
import MapPopUp from '../PopUps/MapPopUp/MapPopUp';

const FeedEvent = ({ event }) => {
    const history = useHistory();
    const [localTime, setLocalTime] = useState(event.eventTime);
    const [showLocation, setShowLocation] = useState(false);
    const [isLiked, setIsLiked] = useState(event.isLikedByUser);
    const [likes, setLikes] = useState(event.likesCount)
    const [reposts, setReposts] = useState(event.repostsCount)
    const [comments, setComments] = useState([]);
    const [commentsCount, setCommentsCount] = useState(event.commentsCount);

    const closeLocationPopUp = () => {
        setShowLocation(false);
    }

    useEffect(() => {
        let localization = window.navigator.userLanguage || window.navigator.language;
        moment.locale(localization);
        let utcTime = moment.utc(event.eventTime);
        setLocalTime(utcTime.local().format('LLL'))
    }, [event.eventTime])

    const onViewButtonClicked = (e) => {
        e.preventDefault();
        history.push('/event/' + event.postId);
    }

    return (<div className="feed feed-event" >
            {showLocation ? 
        <MapPopUp 
            title="Event Location" 
            location={event.locationCity}
            lat={event.latitude}
            long={event.longitude}
            closePopUp={closeLocationPopUp}
            blockPageScroll={true}/>
            : ''}
        <FeedHeader 
            photo={event.creatorImage} 
            name={event.creatorName}
            time={parseTime(event.createdAgo)}
            username={event.username}
            postId={event.postId}/>
        <p className="going-text">Going:</p>
        <div className="event-images">
            <div className="user-photo">
                <img src={event.creatorImage} alt="" />
            </div>
            {event.eventGoing.map((photo) => <div className="user-photo">
                <img src={photo} alt="" />
            </div>)}
        </div>
        <div className="second-row">
            <h2 onClick={onViewButtonClicked}>{event.eventTitle}</h2>
            <button className="join" onClick={onViewButtonClicked}>View</button>
        </div>
        <div className="interests">
            {event.eventInterests.map(interest => <div key={interest.id} className="interest">{interest.label}</div>)}
        </div>
        <div className="third-row">
            <span className="location" onClick={() => setShowLocation(true)}>Location: {event.locationCity}</span>
            <span>{localTime}</span>
        </div>
        <FeedFooter 
            postId={event.postId}
            postType={event.postType}
            isLiked={isLiked}
            setIsLiked={setIsLiked}
            likes={likes}
            setLikes={setLikes}
            comments={comments}
            setComments={setComments}
            commentsCount={commentsCount}
            setCommentsCount={setCommentsCount}
            reposts={reposts} 
            setReposts={setReposts}
            />
    </div>)
}

export default FeedEvent;
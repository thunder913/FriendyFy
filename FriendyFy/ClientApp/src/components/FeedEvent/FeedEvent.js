import React, { useState, useEffect } from 'react';
import './FeedEvent.css';
import FeedHeader from '../FeedHeader/FeedHeader';
import FeedFooter from '../FeedFooter/FeedFooter';
import { parseTime } from '../../services/helperService';
import moment from 'moment';
import MapPopUp from '../PopUps/MapPopUp/MapPopUp';
import { CSSTransition } from 'react-transition-group';
import { Link } from 'react-router-dom';

const FeedEvent = ({ eventData }) => {
    const [localTime, setLocalTime] = useState(eventData.eventTime);
    const [showLocation, setShowLocation] = useState(false);
    const [isLiked, setIsLiked] = useState(eventData.isLikedByUser);
    const [likes, setLikes] = useState(eventData.likesCount)
    const [reposts, setReposts] = useState(eventData.repostsCount)
    const [comments, setComments] = useState([]);
    const [commentsCount, setCommentsCount] = useState(eventData.commentsCount);
    const [event, setEvent] = useState(eventData);
    const [hidePost, setHidePost] = useState(false);


    useEffect(() => {
        let localization = window.navigator.userLanguage || window.navigator.language;
        moment.locale(localization);
        let utcTime = moment.utc(event.eventTime);
        setLocalTime(utcTime.local().format('LLL'))
    }, [event.eventTime])

    useEffect(() => {
        if (eventData) {
            if (eventData.isRepost) {
                setEvent(eventData.repost);
            }
        }
    }, [eventData])

    return (<CSSTransition
        in={!hidePost}
        timeout={800}
        classNames={"feed-post-animation"}
        unmountOnExit
        onEnter={() => setHidePost(false)}
        onExited={() => setHidePost(true)}>
        <div className={"feed feed-event " + (eventData.isRepost ? 'repost' : '')} >
            <MapPopUp
                title="Event Location"
                location={event.locationCity}
                lat={event.latitude}
                long={event.longitude}
                blockPageScroll={true}
                show={showLocation}
                setShow={setShowLocation} />
            {eventData.isRepost ? <FeedHeader
                photo={eventData.creatorImage}
                name={eventData.creatorName}
                time={parseTime(eventData.createdAgo)}
                username={eventData.username}
                postId={eventData.eventPostId}
                postType={eventData.postType}
                setHidePost={setHidePost}
            /> : ''}
            {(eventData.isRepost && eventData.postMessage) ? <span className="repost-text">{eventData.postMessage}</span> : ''}
            <div className='inner-post'>
                <FeedHeader
                    photo={event.creatorImage}
                    name={event.creatorName}
                    time={parseTime(event.createdAgo)}
                    username={event.username}
                    postId={event.eventPostId}
                    postType={event.postType}
                    isRepost={eventData.isRepost}
                    setHidePost={setHidePost}
                    isCreator={eventData.isUserCreator} />
                <div className="event-middle">
                    <div className="event-photo">
                        <img src={event.eventImage} alt="" />
                    </div>
                    <div className="second-row">
                        <Link to={'/event/' + event.postId} className='event-title'>{event.eventTitle}</Link>
                        <div className="interests">
                            {event.eventInterests.map(interest => <Link to={`/search-page?interests=[{"label":"${interest.label}","value":${interest.id}}]`} key={interest.id} className="interest">{interest.label}</Link>)}
                        </div>
                        <Link to={'/event/' + event.postId} className="join">View</Link>
                    </div>
                </div>
                <div className="third-row">
                    <span className="location" onClick={() => setShowLocation(true)}>Location: {event.locationCity}</span>
                    <span>{localTime}</span>
                </div>
            </div>
            <FeedFooter
                repostId={event.eventPostId}
                postId={eventData.eventPostId}
                postType={eventData.postType}
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
                isRepost={eventData.isRepost}
            />
        </div>
    </CSSTransition>)
}

export default FeedEvent;
import React, { useState } from 'react';
import './FeedHeader.css';
import { faEllipsisH } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useHistory } from 'react-router';
import PeopleListPopUp from '../PopUps/PeopleListPopUp/PeopleListPopUp'
import { getTaggedPeople } from '../../services/postService';
import MapPopUp from '../PopUps/MapPopUp/MapPopUp'

function FeedHeader({photo, name, time, username, city, lat, long, taggedPeople, postId}){
    const history = useHistory();
    const [showPostLocation, setShowPostLocation] = useState(false);
    const [showTaggedPeople, setShowTaggedPeople] = useState(false);

    const closePostLocationPopUp = () => {
        setShowPostLocation(false);
    }

    const showPostLocationPopUp = () => {
        setShowPostLocation(true);
    }

    const closeTaggedPeoplePopUp = () => {
        setShowTaggedPeople(false);
    }

    const showTaggedPeopleEvent = () => {
        setShowTaggedPeople(true);
    }

    const loadTaggedPeople = (skip) => {
        return getTaggedPeople(postId, skip, 10);
    }

    const redirectToUserProfile = () => {
        history.push('/profile/' + username);
    }
    
    return(
    <header className="feed-header">
    {showTaggedPeople ? 
    <PeopleListPopUp 
        title="Tagged People"
        count={taggedPeople}
        loadPeople={loadTaggedPeople}
        closePopUp={closeTaggedPeoplePopUp}
    /> : ''}
    {showPostLocation ? 
    <MapPopUp 
        title="Map" 
        location={city}
        lat={lat}
        long={long}
        closePopUp={closePostLocationPopUp}
        blockPageScroll={true}/>
        : ''}

    <div className="header-left">
        <div className="post-creator-image" onClick={redirectToUserProfile}>
            <img src={photo} alt="" />
        </div>
        <div className="header-user-data">
            <div className="upper-post-data">
                <h3 onClick={redirectToUserProfile}>{name}</h3>
                {city != null ? <p className="post-location"> is at <button onClick={showPostLocationPopUp}>{city}</button></p> : ''}
                {taggedPeople && taggedPeople != 0 ? <p>with <button onClick={showTaggedPeopleEvent}> {taggedPeople} {taggedPeople == 1 ? 'person' : 'people'} </button></p> : ''}
                
            </div>  
            <span>{time}</span>
        </div>
    </div>
    <div className="header-right">
        <FontAwesomeIcon className="header-elipsis" icon={faEllipsisH} />
    </div>
</header>)
}



export default FeedHeader;
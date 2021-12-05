import React, { useEffect, useState } from 'react';
import './FeedHeader.css';
import { faEllipsisH } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useHistory } from 'react-router';
import PeopleListPopUp from '../PopUps/PeopleListPopUp/PeopleListPopUp'
import { getTaggedPeople } from '../../services/postService';
import MapPopUp from '../PopUps/MapPopUp/MapPopUp'
import FeedHeaderOptions from '../FeedHeaderOptions/FeedHeaderOptions';
import NotificationManager from "react-notifications/lib/NotificationManager";
import { NotificationContainer } from "react-notifications";

function FeedHeader({photo, name, time, username, city, lat, long, taggedPeople, postId, isRepost, setHidePost}){
    const history = useHistory();
    const [showPostLocation, setShowPostLocation] = useState(false);
    const [showTaggedPeople, setShowTaggedPeople] = useState(false);
    const [showOptions, setShowOptions] = useState(false);
    const [isDeleted, setIsDeleted] = useState(false);
    const [hasError, setHasError] = useState(false);
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

    const showHeaderOptionsEvent = () => {
        setShowOptions(true);
    }
    
    useEffect(() => {
        if(isDeleted){
            if(hasError){
                setHasError(false);
                setIsDeleted(false);
                NotificationManager.error('There was an error deleting the post!', '', 200000);
            }else{
                setHidePost(true);
            }
        }
    }, [isDeleted])

    return(
    <header className="feed-header">
    <NotificationContainer/>
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
    {!isRepost ? <div className="header-right">
        <FontAwesomeIcon className="header-elipsis" icon={faEllipsisH} onClick={showHeaderOptionsEvent}/>
        <FeedHeaderOptions
            showOptions={showOptions} 
            setIsDeleted={setIsDeleted}
            setShowOptions={setShowOptions}
            setHasError={setHasError}/>
    </div> : ''}

</header>)
}



export default FeedHeader;
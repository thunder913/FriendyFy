import React, { useState } from 'react';
import './FeedHeader.css';
import { faEllipsisH } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useHistory } from 'react-router';
import useScrollBlock from "../../hooks/useScrollBlock";
import PeopleListPopUp from '../PeopleListPopUp/PeopleListPopUp'
import { getTaggedPeople } from '../../services/postService';
function FeedHeader({photo, name, time, username, city, lat, long, taggedPeople, postId}){
    const history = useHistory();
    const [showTaggedPeople, setShowTaggedPeople] = useState(false);
    const [blockScroll, allowScroll] = useScrollBlock();

    const closePopUp = () => {
        allowScroll();
        setShowTaggedPeople(false);
    }

    const showTaggedPeopleEvent = () => {
        setShowTaggedPeople(true);
        blockScroll();
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
        closePopUp={closePopUp}
    /> : ''}
    <div className="header-left">
        <div className="post-creator-image" onClick={redirectToUserProfile}>
            <img src={photo} alt="" />
        </div>
        <div className="header-user-data">
            <div className="upper-post-data">
                <h3 onClick={redirectToUserProfile}>{name}</h3>
                {city != null ? <p className="post-location"> is at <button>{city}</button></p> : ''}
                {taggedPeople != 0 ? <p>with <button onClick={showTaggedPeopleEvent}> {taggedPeople} {taggedPeople == 1 ? 'person' : 'people'} </button></p> : ''}
                
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
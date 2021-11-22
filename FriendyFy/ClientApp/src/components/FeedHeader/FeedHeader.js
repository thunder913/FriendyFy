import React from 'react';
import './FeedHeader.css';
import { faEllipsisH } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useHistory } from 'react-router';
function FeedHeader({photo, name, time, username}){
    const history = useHistory();
    
    const redirectToUserProfile = () => {
        history.push('/profile/' + username);
    }
    
    return(
    <header className="feed-header">
    <div className="header-left">
        <div className="post-creator-image" onClick={redirectToUserProfile}>
            <img src={photo} alt="" />
        </div>
        <div className="header-user-data">
            <h3 onClick={redirectToUserProfile}>{name}</h3>
            <span>{time}</span>
        </div>
    </div>
    <div className="header-right">
        <FontAwesomeIcon className="header-elipsis" icon={faEllipsisH} />
    </div>
</header>)
}



export default FeedHeader;
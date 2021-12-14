import React from 'react';
import './Friend.css';
import {Link} from "react-router-dom";
const Friend = ({ friend }) => (
    <Link className="profile-friend" to={`/profile/${friend.username}`}>
        <div className="friend-image">
            <img src={friend.profileImage} alt="" />
        </div>
        <div className="friend-info">
            <span className="friend-name">
                {friend.fullName}
            </span>
            <div className="bottom-section">
                {friend.mutualFriends !== -1 ? <span className="mutual-friends">
                    {!friend.isLoggedUser ? (friend.mutualFriends+' mutual friend'+ (friend.mutualFriends === 1 ? '' : 's')) : 'you'}
                </span> : ''}
                <span className="friend-status">
                    {friend.isLoggedUser ? '' :
                    friend.isFriend ? 'Friends' :
                    friend.hasRequested ? 'Friend Requested' :
                    friend.hasReceived ? 'Request received' : ''}
                </span>
            </div>
        </div>
    </Link>
)

export default Friend;



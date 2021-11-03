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
                <span className="mutual-friends">
                    {friend.mutualFriends} mutual friends
                </span>
                <span className="friend-status">
                    {friend.isFriend ? 'Friends' :
                    friend.hasRequested ? 'Friend Requested' :
                    friend.hasReceived ? 'Request received' : ''}
                </span>
            </div>
        </div>
    </Link>
)

export default Friend;



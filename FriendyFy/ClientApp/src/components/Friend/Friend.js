import React from 'react';
import './Friend.css';

const Friend = ({ friend }) => (
    <div className="profile-friend">
        <div className="friend-image">
            <img src={friend.profileImage} alt="" />
        </div>
        <div className="friend-info">
            <span className="friend-name">
                {friend.fullName}
            </span>
            <span className="mutual-friends">
                {/* {friend.friends.length}*/}{friend.mutualFriends} mutual friends
            </span> 
        </div>
    </div>
)

export default Friend;



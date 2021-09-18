import React from 'react';
import Friend from '../../Friend/Friend';
import './Friends.css';

const Friends = ({friends}) =>(
    <div className="profile-friends">
    {friends.map(friend => <Friend friend={friend}/>)}
    </div>
)

export default Friends;
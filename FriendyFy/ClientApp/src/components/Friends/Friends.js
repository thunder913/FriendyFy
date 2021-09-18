import React from 'react';
import './Friends.css';
import { useHistory } from 'react-router';

const Friends = () =>(
    <div className="profile-friends">
        <div className="profile-friend">
            <div className="friend-image">
                <img src="" alt="" />
            </div>
            <span className="friend-name">
                Andon Gorchov
            </span>
            <span className="mutual-friends">
                3 mutual friends
            </span>
        </div>
    </div>
)

export default Friends;
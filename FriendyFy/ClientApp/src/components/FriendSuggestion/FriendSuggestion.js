import React from 'react';
import './FriendSuggestion.css';

const FriendSuggestion = ({friend}) =>(
        <div className="friend-suggestion">
            <div className="left-side">
                <div className="friend-image">
                    <img src={friend.image} alt="" />
                </div>
            </div>
            <div className="right-side">
                <span>{friend.name}</span>
                <span>{friend.mutualFriends.length} mutual friends</span>
                <span>{friend.commonInterests.length} common interests</span>
            </div>
        </div>
    )

export default FriendSuggestion;
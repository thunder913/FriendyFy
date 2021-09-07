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
                <span className="friend-name">{friend.name}</span>
                <div className="main-suggestion-body">
                    <div className="common-stuff">
                        <span className="friend-friends">{friend.mutualFriends.length} mutual friends</span>
                        <span className="friend-interests">{friend.commonInterests.length} common interests</span>
                    </div>
                    <div className="friend-buttons">
                        <button class="add-friend">Add</button>
                        <button class="remove-suggestion">Remove</button>
                    </div>
                </div>

            </div>
        </div>
    )

export default FriendSuggestion;
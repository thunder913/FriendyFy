import React, { useState } from 'react';
import './FriendSuggestion.css';
import { Link } from 'react-router-dom';
import { addFriend, removeFriendSuggestion } from '../../services/friendService.js';
import { useLoggedIn } from '../../contexts/LoggedInContext.js';

const FriendSuggestion = ({friend}) =>{
    const {loggedIn, setLoggedIn} = useLoggedIn();
    const [show, setShow] = useState(true)

    const addFriendEvent = () => {
        addFriend({userId: friend.username})
            .then(async res => {
                if(res.ok){
                    setShow(false);
                }
        });
    }

    const removeFriendEvent = () => {
        removeFriendSuggestion({userId: friend.username})
            .then(async res => {
                if(res.ok){
                    setShow(false);
                }
            })
    }
    
    if(!show){
        return null;
    }

    return(
            <div className="friend-suggestion" key={friend.username}>
            <div className="left-side">
            <Link to={`/profile/${friend.username}`}>
                <div className="friend-image">
                    <img src={friend.profilePhoto} alt="" />
                </div>
            </Link>
            </div>
            <div className="right-side">
                <Link to={`/profile/${friend.username}`}>
                <span className="friend-name">{friend.name}</span>
                </Link>
                <div className="main-suggestion-body">
                    <div className="common-stuff">
                        <span className="friend-friends">{friend.mutualFriends} mutual friends</span>
                        <span className="friend-interests">{friend.commonInterests} common interests</span>
                    </div>
                    <div className="friend-buttons">
                        <button className="add-friend" onClick={addFriendEvent}>Add</button>
                        <button className="remove-suggestion" onClick={removeFriendEvent}>Remove</button>
                    </div>
                </div>

            </div>
        </div>)
}

export default FriendSuggestion;
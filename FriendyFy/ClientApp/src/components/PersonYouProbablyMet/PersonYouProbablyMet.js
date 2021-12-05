import React from 'react';
import './PersonYouProbablyMet.css';
import { useHistory } from 'react-router';
import { removeFriendSuggestion } from '../../services/friendService';
import { useState } from 'react/cjs/react.development';
import { addFriend } from '../../services/friendService';


const PersonYouProbablyMet = ({person}) =>{
    const history = useHistory();
    const [show, setShow] = useState(true);

    const redirectToUserProfile = () => {
        history.push('/profile/' + person.username);
    }

    const removeFriendEvent = () => {
        removeFriendSuggestion({userId: person.username})
            .then(async res => {
                if(res.ok){
                    setShow(false);
                }
            })
    }

    const addFriendEvent = () => {
        addFriend({userId: person.username})
            .then(async res => {
                if(res.ok){
                    setShow(false);
                }
        });
    }
    
    return(<div className="person-you-met">
            {show ? <div className="left-side">
            <span className="person-name" onClick={redirectToUserProfile}>{person.name}</span>
                <div className="main-suggestion-body">
                    <div className="common-stuff">
                        <span className="friend-friends">You were together at {person.eventsTogether} event{person.eventsTogether > 1 ? "s" : ""}.</span>
                    </div>
                    <div className="friend-buttons">
                        <button className="add-friend" onClick={addFriendEvent}>Add</button>
                        <button className="remove-suggestion" onClick={removeFriendEvent}>Remove</button>
                    </div>
                </div>
            </div> : ''}
            {show ? <div className="right-side">
                <div className="person-image" onClick={redirectToUserProfile}>
                    <img src={person.profilePhoto} alt="" />
                </div>
            </div> : ''}
        </div>)
}

export default PersonYouProbablyMet;
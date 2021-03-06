import React, { useState } from 'react';
import './PersonYouProbablyMet.css';
import { removeFriendSuggestion } from '../../services/friendService';
import { addFriend } from '../../services/friendService';
import { Link } from 'react-router-dom';
import { NotificationManager } from 'react-notifications';

const PersonYouProbablyMet = ({ person }) => {
    const [show, setShow] = useState(true);

    const removeFriendEvent = () => {
        removeFriendSuggestion({ userId: person.username })
            .then(async res => {
                if (res.ok) {
                    setShow(false);
                }
            })
    }

    const addFriendEvent = () => {
        addFriend({ userId: person.username })
            .then(async res => {
                if (res.ok) {
                    NotificationManager.success('Successfully sent the friend request!', '', 2000);
                    setShow(false);
                } else {
                    NotificationManager.error('There was an error sending the friend request!', '', 2000);
                }
            });
    }

    if (!show) {
        return '';
    }
    return (<div className="person-you-met">
        <div className="left-side">
            <Link to={'/profile/' + person.username}><span className="person-name">{person.name}</span></Link>
            <div className="main-suggestion-body">
                <div className="common-stuff">
                    <span className="friend-friends">You were together at {person.eventsTogether} event{(person.eventsTogether > 1 || person.eventsTogether === 0) ? "s" : ""}.</span>
                </div>
                <div className="friend-buttons">
                    <button className="add-friend" onClick={addFriendEvent}>Add</button>
                    <button className="remove-suggestion" onClick={removeFriendEvent}>Remove</button>
                </div>
            </div>
        </div>
        <div className="right-side">
            <Link to={'/profile/' + person.username}>
                <div className="person-image">
                    <img src={person.profilePhoto} alt="" />
                </div>
            </Link>
        </div>
    </div>)
}

export default PersonYouProbablyMet;
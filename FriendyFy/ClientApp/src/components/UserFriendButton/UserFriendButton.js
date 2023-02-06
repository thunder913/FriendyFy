import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { addFriend, checkFriendStatus, cancelFriendRequest, acceptFriendRequest, removeFriend } from '../../services/friendService';
import "./UserFriendButton.css";
import { NotificationManager } from 'react-notifications';

function UserFriendButton({ userId }) {
    const [isHovering, setIsHovering] = useState(false)
    const [friendText, setFriendText] = useState('');

    const addFriendEvent = (e) => {
        e.preventDefault();
        addFriend({ userId: userId })
            .then(async res => {
                if (res.ok) {
                    setFriendText("Requested");
                    NotificationManager.success('Successfully sent a friend request!', '', 2000);
                }
                await renderAddFriend();
            });
    }

    const acceptEvent = (e) => {
        e.preventDefault();
        acceptFriendRequest({ userId: userId })
            .then(async res => {
                if (res.ok) {
                    setFriendText("Friends");
                    NotificationManager.success('You are now friends!', '', 2000);
                }
                await renderAddFriend();
            })
    }

    const declineEvent = (e) => {
        e.preventDefault();
        cancelFriendRequest({ userId: userId })
            .then(async res => {
                if (res.ok) {
                    setFriendText("Add Friends");
                    NotificationManager.success('You declined the friend request!', '', 2000);
                }
                await renderAddFriend();
            })
    }

    const cancelEvent = (e) => {
        e.preventDefault();
        cancelFriendRequest({ userId: userId })
            .then(async res => {
                if (res.ok) {
                    setFriendText("Add Friends");
                    NotificationManager.success('Successfully canceled the request!', '', 2000);
                }
                await renderAddFriend();
            })
    }

    const removeFriendEvent = (e) => {
        e.preventDefault();
        removeFriend({ userId: userId })
            .then(async res => {
                if (res.ok) {
                    setFriendText("NoFriends");
                    NotificationManager.success('Successfully removed friend!', '', 2000);
                }
                await renderAddFriend();
            })
    }

    const renderAddFriend = async () => {
        await checkFriendStatus(userId)
            .then(async res => {
                let text = await res.text();
                switch (text) {
                    case 'Friends':
                        setFriendText("Friends")
                        break;
                    case 'Requested':
                        setFriendText("Requested")
                        break;
                    case 'Received':
                        setFriendText("Received")
                        break;
                    case 'NoFriends':
                        setFriendText("Add Friend")
                        break;
                    case 'SameUser':
                        setFriendText("Manage")
                        break;
                    default:
                        setFriendText("None")
                        break;
                }
            });

    }

    useState(() => {
        renderAddFriend();
    }, [])

    if (friendText === "None") {
        return '';
    }

    return (
        <div className="add-friend-nav">
            {friendText === "Requested" ?
                <button className="request-cancel" onClick={cancelEvent}>Cancel Friend Request</button>
                : friendText === "Received" ? <div className="receive">
                    <button className="accept" onClick={acceptEvent}>Accept</button>
                    <button className="decline" onClick={declineEvent}>Decline</button>
                </div>
                    : friendText === "Friends" ?
                        <button
                            className="add-friend remove-friend"
                            onClick={removeFriendEvent}
                            onMouseEnter={() => setIsHovering(true)}
                            onMouseLeave={() => setIsHovering(false)}>
                            {isHovering ? "Remove Friend" : friendText}
                        </button>
                        : friendText === "Add Friend" ? <button className="add-friend " onClick={addFriendEvent}>
                            {friendText}
                        </button>
                            : <Link to="/settings" className="add-friend">
                                {friendText}
                            </Link>}
        </div>
    );
}

export default UserFriendButton;
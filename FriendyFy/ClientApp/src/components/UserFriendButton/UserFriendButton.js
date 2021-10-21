import React, {useState, useEffect} from 'react';
import { addFriend, checkFriendStatus, cancelFriendRequest, acceptFriendRequest, removeFriend } from '../../services/userService';
import "./UserFriendButton.css"
function UserFriendButton({userId}){
    const [isHovering, setIsHovering] = useState(false)
    const [friendStatus, setFriendStatus] = useState('');
    const [friendText, setFriendText] = useState('');

    const addFriendEvent = () => {
        addFriend({userId: userId})
            .then(async res => {
                if(res.ok){
                    setFriendText("Requested");
                }
            await renderAddFriend();
        });
    }

    const acceptEvent = () => {
        acceptFriendRequest({userId: userId})
            .then(async res => {
                if(res.ok){
                    setFriendText("Friends");
                }
            await renderAddFriend();
        })
    }

    const declineEvent = () => {
        cancelFriendRequest({userId: userId})
        .then(async res => {
            if(res.ok){
                setFriendText("Add Friends");
            }
            await renderAddFriend();
        })
    }

    const cancelEvent = () => {
        cancelFriendRequest({userId: userId})
        .then(async res => {
            if(res.ok){
                setFriendText("Add Friends");
            }
            await renderAddFriend();
        })
    }

    const removeFriendEvent = () => {
        removeFriend({userId: userId})
        .then(async res => {
            if(res.ok){
                setFriendText("no-friends");
            }
            await renderAddFriend();
        })
    }

    const renderAddFriend = async () => {
        await checkFriendStatus({userId: userId})
            .then(async res => {
                let text = await res.text();
                console.log(text);
                switch(text){
                    case 'friends':
                        setFriendText("Friends")
                        break;
                    case 'requested':
                        setFriendText("Requested")
                        break;
                    case 'received':
                        setFriendText("Received")
                        break;
                    case 'no-friends':
                        setFriendText("Add Friend")
                        break;
                    case 'same-user':
                        setFriendText("Manage")
                        break;
                }
            });

    }

    useState(() => {
        renderAddFriend();
    }, [])

    return(
        <div className="add-friend-nav">

                {friendText == "Requested" ? 
                <a className="request-cancel" onClick={cancelEvent}>Cancel Friend Request</a> : 
                friendText=="Received" 
                ? <div className="receive">
                    <a className="accept" onClick={acceptEvent}>Accept</a>
                    <a className="decline" onClick={declineEvent}>Decline</a>
                </div> : friendText=="Friends" ?
                <a 
                    className="add-friend remove-friend" 
                    onClick={removeFriendEvent}
                    onMouseEnter={() => setIsHovering(true)}
                    onMouseLeave={() => setIsHovering(false)}>
                    {isHovering ? "Remove Friend" : friendText}
                </a>
                :
                <a className="add-friend " onClick={addFriendEvent}>
                    {friendText}
                </a>}
        </div>
    );
}

export default UserFriendButton;
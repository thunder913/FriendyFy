import React, {useState} from 'react';
import { addFriend, checkFriendStatus, cancelFriendRequest, acceptFriendRequest, removeFriend } from '../../services/friendService';
import "./UserFriendButton.css"
function UserFriendButton({userId}){
    const [isHovering, setIsHovering] = useState(false)
    const [friendText, setFriendText] = useState('');

    const addFriendEvent = (e) => {
        e.preventDefault();
        addFriend({userId: userId})
            .then(async res => {
                if(res.ok){
                    setFriendText("Requested");
                }
            await renderAddFriend();
        });
    }

    const acceptEvent = (e) => {
        e.preventDefault();
        acceptFriendRequest({userId: userId})
            .then(async res => {
                if(res.ok){
                    setFriendText("Friends");
                }
            await renderAddFriend();
        })
    }

    const declineEvent = (e) => {
        e.preventDefault();
        cancelFriendRequest({userId: userId})
        .then(async res => {
            if(res.ok){
                setFriendText("Add Friends");
            }
            await renderAddFriend();
        })
    }

    const cancelEvent = (e) => {
        e.preventDefault();
        cancelFriendRequest({userId: userId})
        .then(async res => {
            if(res.ok){
                setFriendText("Add Friends");
            }
            await renderAddFriend();
        })
    }

    const removeFriendEvent = (e) => {
        e.preventDefault();
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
                    default:
                        break;
                }
            });

    }

    useState(() => {
        renderAddFriend();
    }, [])

    return(
        <div className="add-friend-nav">

                {friendText === "Requested" ? 
                <button className="request-cancel" onClick={cancelEvent}>Cancel Friend Request</button> : 
                friendText==="Received" 
                ? <div className="receive">
                    <button className="accept" onClick={acceptEvent}>Accept</button>
                    <button className="decline" onClick={declineEvent}>Decline</button>
                </div> : friendText==="Friends" ?
                <button 
                    className="add-friend remove-friend" 
                    onClick={removeFriendEvent}
                    onMouseEnter={() => setIsHovering(true)}
                    onMouseLeave={() => setIsHovering(false)}>
                    {isHovering ? "Remove Friend" : friendText}
                </button>
                :
                <button className="add-friend " onClick={addFriendEvent}>
                    {friendText}
                </button>}
        </div>
    );
}

export default UserFriendButton;
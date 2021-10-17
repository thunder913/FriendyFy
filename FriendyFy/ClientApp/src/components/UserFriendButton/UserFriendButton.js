import React, {useState, useEffect} from 'react';
import { addFriend, checkFriendStatus } from '../../services/userService';

function UserFriendButton({userId}){
    const [friendStatus, setFriendStatus] = useState('');
    const [friendText, setFriendText] = useState('');

    const addFriendEvent = () => {
        addFriend({userId: userId})
            .then(res => {
                if(res.ok){
                    setFriendText("Requested");
                }
            });
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
            <a className="add-friend " onClick={addFriendEvent}>
                {friendText}
            </a>
        </div>
    );
}

export default UserFriendButton;
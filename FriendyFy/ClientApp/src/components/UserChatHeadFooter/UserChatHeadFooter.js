import React from 'react';
import './UserChatHeadFooter.css';

function UserChatHeadFooter({person}){
    let userOnline;
    let unreadMessages;
    if (person.isOnline) {
        userOnline = <div className="user-online"></div>;
    }else{
        userOnline = <div className="user-offline"></div>;
    }
    if (person.hasUnreadMessages) {
        unreadMessages = <div className="user-has-messages">
            <span>9+</span>
        </div>;
    }

    return (
        <div className="user-chat-head">
            <div className="footer-user-image">
                <img src={person.image} alt="UserImage" />
            </div>
            {userOnline}
            {unreadMessages}
            <span className="footer-chat-username">{person.name}</span>
        </div>
        )
}

export default UserChatHeadFooter;
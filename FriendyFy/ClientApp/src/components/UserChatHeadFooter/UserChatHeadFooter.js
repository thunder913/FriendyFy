import React from 'react';
import './UserChatHeadFooter.css';

function UserChatHeadFooter({person}){
    return (
        <div className="user-chat-head">
            <div className="footer-user-image">
                <img src={person.image} alt="UserImage" />
            </div>
            <span className="footer-chat-username">{person.name}</span>
            <span className="footer-chat-isOnline">{person.isOnline ? "True" : "False"}</span>
            <span className="footer-chat-hasUnreadMessages">{person.hasUnreadMessages ? "True" : "False"}</span>
        </div>
        )
}

export default UserChatHeadFooter;
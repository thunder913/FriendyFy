import React from 'react';
import './UserChatHeadFooter.css';

function UserChatHeadFooter({person}){
    const [showChat, setShowChat] = React.useState(false);
    const onClick = () => setShowChat(!showChat);

    let userOnline;
    let unreadMessages;
    if (person.isOnline) {
        userOnline = <div className="user-online"></div>;
    }else{
        userOnline = <div className="user-offline"></div>;
    }
    if (person.hasUnreadMessages) {
        unreadMessages = <div className="user-has-messages">
            <span>1</span>
        </div>;
    }

    return (
        <div className="user-chat-head" onClick={onClick}>
            {showChat ? <div>TEST</div> : ""}
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
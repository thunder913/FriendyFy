import React from 'react';
import UserChatHeadBox from '../UserChatHeadBox/UserChatHeadBox';
import './UserChatHeadFooter.css';

function UserChatHeadFooter({person}){
    const [showChat, setShowChat] = React.useState(false);
    const onClick = (e) => 
        {
            console.log(e.target);
            let text = e.target.closest('.user-chat-head');
            setShowChat(!showChat)
            if (!showChat) {
                text.style.paddingRight = '200px';   
            }else{
                text.style.paddingRight = '10px';
            }
        };

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
        <div className="user-chat-head">
            {showChat ? <UserChatHeadBox/> : ""}
            <div className="user-footer" onClick={onClick}>
            <div className="footer-user-image">
                <img src={person.image} alt="UserImage" />
            </div>
            {userOnline}
            {unreadMessages}
            <span className="footer-chat-username">{person.name}</span>
            </div>
        </div>
        )
}

export default UserChatHeadFooter;
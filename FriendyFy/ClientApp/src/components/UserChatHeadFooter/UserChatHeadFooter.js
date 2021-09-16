import React from 'react';
import UserChatHeadBox from '../UserChatHeadBox/UserChatHeadBox';
import './UserChatHeadFooter.css';
import $ from 'jquery';
function UserChatHeadFooter({person}){
    const [showChat, setShowChat] = React.useState(false);
    const [bigChatBox, setBigChatBox] = React.useState(false);
    
    const onClick = (e) => 
        {
            let text;     
            if(e.target.classList.contains('user-chat-head')){
                text = e.target.querySelector('.user-footer');
            }else{
                text = e.target.closest('.user-footer');
            }       
            if (!showChat) {
            }
            setBigChatBox(!bigChatBox);
            setShowChat(!showChat);
        };

    const closeChatPopup = () => {
        setBigChatBox(!bigChatBox);
        setTimeout(() => {
            setShowChat(!showChat);
        }, 300);
    }

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
        <div className="user-chat-head" >
            {showChat ? <UserChatHeadBox changeChatBox={() => closeChatPopup()}/> : ""}
            <div className="user-footer" 
                onClick={onClick} 
                style={{width: bigChatBox ? "310px" : "100%"}}>
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
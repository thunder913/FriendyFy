import React from 'react';
import UserChatHeadBox from '../UserChatHeadBox/UserChatHeadBox';
import './UserChatHeadFooter.css';
function UserChatHeadFooter({chat, connection}){
    const [showChat, setShowChat] = React.useState(false);
    const [bigChatBox, setBigChatBox] = React.useState(false);
    
    const onClick = (e) => 
        {  
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
    if (chat.isActive) {
        userOnline = <div className="user-online"></div>;
    }else{
        userOnline = <div className="user-offline"></div>;
    }
    if (chat.newMessages > 0) {
        unreadMessages = <div className="user-has-messages">
            <span>1</span>
        </div>;
    }

    return (
        <div className="user-chat-head" >
            {showChat ? <UserChatHeadBox connection={connection} chatId={chat.chatId} changeChatBox={() => closeChatPopup()}/> : ""}
            <div className="user-footer" 
                onClick={onClick} 
                style={{width: bigChatBox ? "310px" : "100%"}}>
            <div className="footer-user-image">
                <img src={chat.picture} alt="UserImage" />
            </div>
            {userOnline}
            {unreadMessages}
            <span className="footer-chat-username">{chat.name}</span>
            </div>
        </div>
        )
}

export default UserChatHeadFooter;
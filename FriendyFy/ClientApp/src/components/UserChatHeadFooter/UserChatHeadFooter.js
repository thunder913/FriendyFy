import React, { useEffect, useState } from 'react';
import UserChatHeadBox from '../UserChatHeadBox/UserChatHeadBox';
import './UserChatHeadFooter.css';
import { getChat, sendMessage } from '../../services/chatService';
import { useLoggedIn } from '../../contexts/LoggedInContext';

function UserChatHeadFooter({chatDetails, connection}){
    const {loggedIn} = useLoggedIn();
    const [showChat, setShowChat] = React.useState(false);
    const [bigChatBox, setBigChatBox] = React.useState(false);
    const [chat, setChat] = useState({messages: []});

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

    useEffect(() => {
        getChat(loggedIn.userName, chatDetails.chatId, 20, 0)
            .then(async res => setChat(await res.json()));
    }, [])

    useEffect(() => {
        if (connection) {
              connection.on("ReceiveMessage", (message) => {
                  console.log(message);
                  setChat(prevState => ({image: prevState.image, name: prevState.name, messages: [...prevState.messages, message]}))
              });
        }
      }, [connection]);

    const sendMessageEvent = (message, setMessage) => {
        connection.send("SendMessage", {chatId: chatDetails.chatId, message});
        setMessage('');
    };

    const loadMoreMessages = () => {
        getChat(loggedIn.userName, chatDetails.chatId, 20, chat.messages.length)
            .then(async res => { let obj = await res.json(); setChat(prevState => ({image: prevState.image, name: prevState.name, messages: [...obj.messages, ...prevState.messages]}))});
    }

    let userOnline;
    let unreadMessages;
    if (chatDetails.isActive) {
        userOnline = <div className="user-online"></div>;
    }else{
        userOnline = <div className="user-offline"></div>;
    }
    if (chatDetails.newMessages > 0) {
        unreadMessages = <div className="user-has-messages">
            <span>1</span>
        </div>;
    }

    return (
        <div className="user-chat-head" >
            {showChat ? <UserChatHeadBox 
            changeChatBox={() => closeChatPopup()}
            sendMessageEvent={sendMessageEvent}
            chat={chat}
            loadMoreMessages={loadMoreMessages}/> : ""}
            <div className="user-footer" 
                onClick={onClick}
                style={{width: bigChatBox ? "310px" : "100%"}}>
            <div className="footer-user-image">
                <img src={chatDetails.picture} alt="UserImage" />
            </div>
            {userOnline}
            {unreadMessages}
            <span className="footer-chat-username">{chatDetails.name}</span>
            </div>
        </div>
        )
}

export default UserChatHeadFooter;
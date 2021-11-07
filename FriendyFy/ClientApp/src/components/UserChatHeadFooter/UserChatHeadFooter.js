import React, { useEffect, useState, useRef } from 'react';
import UserChatHeadBox from '../UserChatHeadBox/UserChatHeadBox';
import './UserChatHeadFooter.css';
import { getChat, seeMessages } from '../../services/chatService';
import { useLoggedIn } from '../../contexts/LoggedInContext';

function UserChatHeadFooter({chatDetails, connection}){
    // TODO
    // Make the receive thingy on the Footer (upper component) and make it somehow, when I receive a message and open the chat, it becomes seen
    // and make the chatDetails.newMessages into a state
    const {loggedIn} = useLoggedIn();
    const [hasUnreadMessages, setHasUnreadMessages] = useState(chatDetails.newMessages > 0); 
    const [showChat, setShowChat] = useState(false);
    const [bigChatBox, setBigChatBox] = useState(false);
    const [chat, setChat] = useState({messages: []});
    const [hasMore, setHasMore] = useState(true);
    const [firstTime, setFirstTime] = useState(true);
    const [userOnline, setUserOnline] = useState('');
    const [unreadMessages, setUnreadMessages] = useState('');
    const latestChat = useRef(null);
    latestChat.current = chat;
    const isChatOpen = useRef(null);
    isChatOpen.current = bigChatBox;
    
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
        if(showChat && firstTime){
        getChat(loggedIn.userName, chatDetails.chatId, 20, 0)
            .then(async res => {
                let obj = await res.json();
                if(obj.messages.length>0){
                    checkChatMessages(obj.messages);
                }
                setChat(obj)
                if(obj.messages.length == 0){
                    setHasMore(false);
                }
                setHasUnreadMessages(false);
                chatDetails.newMessages=0;
            })
            setFirstTime(false);
        }
        }, [showChat])

    useEffect(() => {
        if (connection) {
              connection.on(chatDetails.chatId, (message) => {
                  //When adding check if the previous message has same username and change the isTopMessage and
                  //isBottomMessage the way they should be
                  //find out why the chat here is not the actual state......
                  message.isBottomMessage=true;
                  let firstMessage = latestChat.current.messages[0];
                  let chatMessages = [...latestChat.current.messages];
                  if(latestChat.current.messages.length>0 && latestChat.current.messages[0].username===message.username){
                      message.isTopMessage=false;
                      firstMessage.isBottomMessage=false;
                  }else{
                      message.isTopMessage=true;
                      firstMessage.isBottomMessage=true;
                  }
                  chatMessages[0] = firstMessage;
                  setChat(prevState => ({image: prevState.image, name: prevState.name, messages: [message ,...chatMessages]}));
                  console.log(isChatOpen.current, 'chat open')
                  console.log(message.isYourMessage, 'is your message')
                  if(!message.isYourMessage){
                    if(isChatOpen.current){
                        seeMessages({chatId: chatDetails.chatId});
                    }else{
                        setHasUnreadMessages(true);
                      chatDetails.newMessages++;
                    }
                  }

              });
        }
      }, []);

    const sendMessageEvent = (message, setMessage) => {
        connection.send("SendMessage", {chatId: chatDetails.chatId, message});
        setMessage('');
    };

    const loadMoreMessages = () => {
        return getChat(loggedIn.userName, chatDetails.chatId, 20, chat.messages.length)
            .then(async res => { 
                let obj = await res.json();
                if(obj.messages.length>0){
                    checkChatMessages(obj.messages);
                    setChat(prevState => ({image: prevState.image, name: prevState.name, messages: [...prevState.messages, ...obj.messages]}));
                }
                else{
                    setHasMore(false);
                }
            })
        }

    const checkChatMessages = (messages) => {
        const messagesToGet = 1;
        // if there are previously added messages in the state and if so, add the first messages to check them
        if(chat.messages && chat.messages.length > 0){
            // check if the top message is again the top message (sent by same user)
            let firstMessage = chat.messages[chat.messages.length-1];
            if(firstMessage && firstMessage.username == messages[0].username){
                firstMessage.isTopMessage = false;
                let chatMessages = [...chat.messages];
                chatMessages[chat.messages.length-messagesToGet] = firstMessage;
                setChat(prevState => ({image: prevState.image, name: prevState.name, messages: [...chatMessages]}));
            }
            messages = [...chat.messages.slice(chat.messages.length-1, chat.messages.length), ...messages];
        }
        
        // for every message, check if the message is top/bottom/middle
        // start at messageToGet if there are any messages in the state or start with 0 when there are none
        for (let i = chat.messages.length>0 ? messagesToGet : 0; i < messages.length; i++) {
            //The logic is reverted, because the messages are flex-reversed
            messages[i].isTopMessage=true;
            messages[i].isBottomMessage=true;
            if(i-1>=0 && messages[i].username == messages[i-1].username){
                messages[i].isBottomMessage = false;
            }
            if(i != messages.length && i+1 < messages.length && messages[i].username == messages[i+1].username){
                messages[i].isTopMessage = false;
            }
        }

        // if there are messages in the state, revert the changes in the first if
        if(chat.messages && chat.messages.length > 0){
            messages.splice(0, messagesToGet);
        }
    }


    useEffect(() => {
        if (chatDetails.isActive) {
            setUserOnline(<div className="user-online"></div>);
        }else{
            setUserOnline(<div className="user-offline"></div>);
        }
        if (hasUnreadMessages) {
            let messages = chatDetails.newMessages > 9 ? "9+" : chatDetails.newMessages;
            setUnreadMessages(<div className="user-has-messages">
                <span>{messages}</span>
            </div>);
        }else{
            setUnreadMessages('');
        }
    }, [hasUnreadMessages])


    return (
        <div className="user-chat-head" >
            {showChat ? <UserChatHeadBox 
            hasMore={hasMore}
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
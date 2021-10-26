import React, { useEffect, useState } from 'react';
import './UserChatHeadBox.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import $ from 'jquery';
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import FadeIn from 'react-fade-in'
import { getChat, sendMessage } from '../../services/chatService';
import { useLoggedIn } from '../../contexts/LoggedInContext';
import ChatMessage from '../ChatMessage/ChatMessage';

function UserChatHeadBox({changeChatBox, chatId, connection}) {

    const {loggedIn} = useLoggedIn();
    const [chat, setChat] = useState({messages: []});
    const [message, setMessage] = useState('');
    const closeChatPopup = (e) => {
        $(e.target).closest('#live-chat').slideToggle(300, 'swing');
        e.preventDefault();

        changeChatBox();
    }

    useEffect(() => {
        getChat(loggedIn.userName, chatId, 20, 0)
            .then(async res => setChat(await res.json()));
    }, [])

    const sendMessageEvent = (e) => {
        e.preventDefault();
        console.log(connection)
        connection.send("SendMessage", {chatId, message});
        // sendMessage(chatId, message)
        //     .then(res => setMessage(''))
    };

    return (
    <div id="live-chat">
        <FadeIn>
        <header className="" onClick={closeChatPopup}>
            <div className="user-header">
            <div className="other-user-chat-image">
                        <img src={chat.image} alt="" width="32" height="32" />
            </div>
            <h4>{chat.name}</h4>
            </div>

            <a href="#" className="chat-close">x</a>
            <span className="chat-message-counter">3</span>
        </header>
        <div className="chat">
            <div className="chat-history">
                {chat.messages.map(message => <ChatMessage key={message.messageId} message={message}/>)}
            </div>
            <form className="send-message-container" action="#" method="post">
                <fieldset>
                    <input 
                        className="send-message" 
                        type="text" placeholder="Message" 
                        value={message} 
                        onChange={(e) => setMessage(e.target.value)} 
                        autoFocus />
                    <button className="send-message-button" onClick={sendMessageEvent}>
                        <FontAwesomeIcon className="paper-plane" icon={faPaperPlane} />
                    </button>
                </fieldset>
            </form>
        </div>
    </FadeIn>
    </div>
    )
}
export default UserChatHeadBox;
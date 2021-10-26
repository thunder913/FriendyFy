import React, { useEffect, useState } from 'react';
import './UserChatHeadBox.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import $ from 'jquery';
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import FadeIn from 'react-fade-in'
import { getChat } from '../../services/chatService';
import { useLoggedIn } from '../../contexts/LoggedInContext';
import ChatMessage from '../ChatMessage/ChatMessage';

function UserChatHeadBox({changeChatBox, chatId}) {

    const {loggedIn} = useLoggedIn();
    const [chat, setChat] = useState({messages: []});
    const closeChatPopup = (e) => {
        $(e.target).closest('#live-chat').slideToggle(300, 'swing');
        e.preventDefault();

        changeChatBox();
    }

    useEffect(() => {
        console.log('test')
        getChat(loggedIn.userName, chatId, 20, 0)
            .then(async res => setChat(await res.json()));
    }, [])

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
                {chat.messages.map(message => <ChatMessage key={message.messageId} message={message}></ChatMessage>)}
            </div>
            <form className="send-message-container" action="#" method="post">
                <fieldset>
                    <input className="send-message" type="text" placeholder="Message" autoFocus />
                    <button className="send-message-button">
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
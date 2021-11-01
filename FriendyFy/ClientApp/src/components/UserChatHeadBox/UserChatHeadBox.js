import React, { useState, useEffect, useRef } from 'react';
import './UserChatHeadBox.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import $ from 'jquery';
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import FadeIn from 'react-fade-in'
import ChatMessage from '../ChatMessage/ChatMessage';

function UserChatHeadBox({changeChatBox, chat, sendMessageEvent, loadMoreMessages}) {

    const chatRef = useRef(null);
    const [message, setMessage] = useState('');
    const [firstLoad, setFirstLoad] = useState(true);
    const closeChatPopup = (e) => {
        $(e.target).closest('.live-chat').slideToggle(300, 'swing');
        e.preventDefault();

        changeChatBox();
    }

    useEffect(()=>{
        document.getElementsByClassName('chat-history')[0].addEventListener('mousewheel', function(e) {
            this.scrollTop -= (e.wheelDelta*2);
            e.preventDefault();
          }, false);
          document.getElementsByClassName('send-message-container')[0].addEventListener('mousewheel', function(e) {
              let chatElement = e.target.closest('.chat').querySelector('.chat-history');
            chatElement.scrollTop -= (e.wheelDelta*2);
            e.preventDefault();
          }, false);
          if(firstLoad){
            scrollToBottom();
            setFirstLoad(false);
        }
    })

    const sendMessage = (e) => {
        e.preventDefault();
        sendMessageEvent(message, setMessage);
    }

    const scrollToBottom = () => {
        scrollChatToHeight(0);
    }

    const loadMoreMessagesEvent = () => {
        let chat = chatRef.current;

        //Get the max scroll
        const scrollHeight = chat.scrollHeight;
        const clientHeight = chat.clientHeight;
        const maxScrollTop = scrollHeight - clientHeight;

        //Calculate the scroll from the bottom
        let scrollBottom = maxScrollTop - chat.scrollTop;
        loadMoreMessages().then(() => scrollChatToHeight(scrollBottom));
    }

    // Give this function the height from the bottom
    const scrollChatToHeight = (bottomHeight) => {
        let chat = chatRef.current;
        chat.style.scrollBehavior = 'auto';

        // Get the new max height, after the operations
        const scrollHeight = chat.scrollHeight;
        const clientHeight = chat.clientHeight;
        const maxScrollTop = scrollHeight - clientHeight;
        
        // Get the calculated height
        let currentScroll = maxScrollTop - bottomHeight;
        chat.scrollTop = currentScroll > 0 ? currentScroll : 0;
        chat.style.scrollBehavior = 'smooth';
    }

    return (
    <div className="live-chat">
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
            <div className="chat-history" ref={chatRef}>
                <div className="load-messages">
                    <button onClick={loadMoreMessagesEvent}>Load More Messages</button>
                </div>
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
                    <button className="send-message-button" onClick={sendMessage}>
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
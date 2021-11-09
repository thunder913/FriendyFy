import React, { useState, useEffect } from 'react';
import './UserChatHeadBox.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import $ from 'jquery';
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import FadeIn from 'react-fade-in'
import ChatMessage from '../ChatMessage/ChatMessage';
import InfiniteScroll from 'react-infinite-scroll-component';

function UserChatHeadBox({changeChatBox, chat, sendMessageEvent, loadMoreMessages, hasMore}) {

    const [message, setMessage] = useState('');
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
    })

    const sendMessage = (e) => {
        e.preventDefault();
        sendMessageEvent(message, setMessage);
    }

    return (
    <div className="live-chat">
        <FadeIn>
        <header className="chat-header" onClick={closeChatPopup}>
            <div className="user-header">
            <div className="other-user-chat-image">
                        <img src={chat.image} alt="" width="32" height="32" />
            </div>
            <h4>{chat.name}</h4>
            </div>

            {/* <a href="#" className="chat-close">x</a> */}
        </header>
        <div className="chat">
                <InfiniteScroll
                    className="chat-history"
                    dataLength={chat.messages.length}
                    next={loadMoreMessages}
                    height={300}
                    inverse={true}
                    hasMore={hasMore}
                    loader={<h4 className="loading-text">Loading...</h4>}
                    scrollableTarget="scrollableDiv"
                    endMessage={
                        <p style={{ textAlign: 'center' }}>
                          <b>You reached the first message!</b>
                        </p>
                      }
                >
                    {chat.messages.map(message => <ChatMessage key={message.messageId} message={message}/>)}
                </InfiniteScroll>
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
import React, { useEffect } from 'react';
import './UserChatHeadBox.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import $ from 'jquery';
import { faPaperPlane, faPlane } from '@fortawesome/free-solid-svg-icons';
import FadeIn from 'react-fade-in'

function UserChatHeadBox(props) {

    useEffect(() => {
    })

    const closeChatPopup = (e) => {
        $(e.target).closest('#live-chat').slideToggle(300, 'swing');
        e.preventDefault();

        props.changeChatBox();
    }

    return (
    <div id="live-chat">
        <FadeIn>
        <header className="" onClick={closeChatPopup}>
            <div className="user-header">
            <div className="other-user-chat-image">
                        <img src="http://gravatar.com/avatar/2c0ad52fc5943b78d6abe069cc08f320?s=32" alt="" width="32" height="32" />
            </div>
            <h4> Mehmet Mert</h4>
            </div>

            <a href="#" className="chat-close">x</a>
            <span className="chat-message-counter">3</span>
        </header>
        <div className="chat">
            <div className="chat-history">
                <div className="chat-message clearfix your-message">
                    <div className="chat-message-content clearfix">
                        <span className="chat-time">13: 35</span>
                        <h5>You</h5>
                        <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit.Error, explicabo quasi ratione odio dolorum harum.</p>
                    </div>
                </div>
                <hr />
                <div className="chat-message clearfix other-user-message">
                    <div className="other-user-chat-image">
                        <img src="http://gravatar.com/avatar/2c0ad52fc5943b78d6abe069cc08f320?s=32" alt="" width="32" height="32" />
                    </div>
                    <div className="chat-message-content clearfix">
                        <span className="chat-time">13: 37</span>
                        <h5>Marco Biedermann</h5>
                        <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit.Blanditiis, nulla accusamus magni vel debitis numquam qui tempora rem voluptatem delectus!</p>
                    </div>
                </div>
                <hr />

                <div className="chat-message clearfix your-message">
                    <div className="chat-message-content clearfix">
                        <span className="chat-time">13: 38</span>
                        <h5>You</h5>
                        <p>Lorem ipsum dolor sit amet, consectetur adipisicing.</p>
                    </div>
                </div>
                <hr />
            </div>
            <form className="send-message-container" action="#" method="post">
                <fieldset>
                    <input className="send-message" type="text" placeholder="Message" autofocus />
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
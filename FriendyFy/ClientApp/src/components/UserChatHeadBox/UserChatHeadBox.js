import React, { useEffect } from 'react';
import './UserChatHeadBox.css';
import $ from 'jquery';
function UserChatHeadBox(props) {

    useEffect(() => {
    
        // $('.chat-close').on('click', function(e) {

        // });
    })

    const closeChatPopup = (e) => {
        // $(e.target).closest('#live-chat').fadeOut(300);
        $(e.target).closest('#live-chat').slideToggle(300, 'swing');
        e.preventDefault();

        props.changeChatBox();
    }

    return (
    <div id="live-chat">
        <header class="clearfix" onClick={closeChatPopup}>
            <a href="#" class="chat-close">x</a>
            <h4>Mehmet Mert</h4>
            <span class="chat-message-counter">3</span>
        </header>
        <div class="chat">
            <div class="chat-history">
                <div class="chat-message clearfix">
                    <img src="http://lorempixum.com/32/32/people" alt="" width="32" height="32" />
                    <div class="chat-message-content clearfix">
                        <span class="chat-time">13: 35</span>
                        <h5>John Doe</h5>
                        <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit.Error, explicabo quasi ratione odio dolorum harum.</p>
                    </div>
                </div>
                <hr />
                <div class="chat-message clearfix">
                    <img src="http://gravatar.com/avatar/2c0ad52fc5943b78d6abe069cc08f320?s=32" alt="" width="32" height="32" />
                    <div class="chat-message-content clearfix">
                        <span class="chat-time">13: 37</span>
                        <h5>Marco Biedermann</h5>
                        <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit.Blanditiis, nulla accusamus magni vel debitis numquam qui tempora rem voluptatem delectus!</p>
                    </div>
                </div>
                <hr />

                <div class="chat-message clearfix">
                    <img src="http://lorempixum.com/32/32/people" alt="" width="32" height="32" />
                    <div class="chat-message-content clearfix">
                        <span class="chat-time">13: 38</span>
                        <h5>John Doe</h5>
                        <p>Lorem ipsum dolor sit amet, consectetur adipisicing.</p>
                    </div>
                </div>
                <hr />
            </div>
            <p class="chat-feedback">Yazıyor..</p>
            <form className="send-message-container" action="#" method="post">
                <fieldset>
                    <input className="send-message" type="text" placeholder="Mesajınızı Yazın" autofocus />
                    <input type="hidden" />
                </fieldset>
            </form>
        </div>
    </div>
    )
}
export default UserChatHeadBox;
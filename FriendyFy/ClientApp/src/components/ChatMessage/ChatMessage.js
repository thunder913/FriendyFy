import React from "react";

function ChatMessage(message) {
    if (message.isYourMessage) {
        return (<section><hr />
            <div className="chat-message clearfix your-message">
                <div className="chat-message-content clearfix">
                    <span className="chat-time">{message.date}</span>
                    <h5>You</h5>
                    <p>{message.message}</p>
                </div>
            </div>
        </section>)
    }

    return (<div><hr /><div className="chat-message clearfix other-user-message">
        <div className="other-user-chat-image">
            <img src={message.photo} alt="" width="32" height="32" />
        </div>
        <div className="chat-message-content clearfix">
            <span className="chat-time">{message.date}</span>
            <h5>{message.name}</h5>
            <p>{message.message}</p>
        </div>
    </div>
    </div>)
}

export default ChatMessage;
import React, { useState } from "react";
import moment from "moment";

function ChatMessage({message}) {
    function getTime(time){
        let timeFormat = 'HH:mm ' + moment.localeData().longDateFormat('L');
        let testDateUtc = moment.utc(time);
        let localDate = testDateUtc.local();
        return localDate.format(timeFormat);
    }

    if (message.isYourMessage) {
        return (<section><hr/>
            <div className="chat-message clearfix your-message">
                <div className="chat-message-content clearfix">
                    <span className="chat-time">{getTime(message.date)}</span>
                    <h5>You</h5>
                    <p>{message.message}</p>
                </div>
            </div>
        </section>)
    }

    return (<section><hr /><div className="chat-message clearfix other-user-message">
        <div className="other-user-chat-image">
            <img src={message.photo} alt="" width="32" height="32" />
        </div>
        <div className="chat-message-content clearfix">
            <span className="chat-time">{getTime(message.date)}</span>
            <h5>{message.name}</h5>
            <p>{message.message}</p>
        </div>
    </div>
    </section>)
}

export default ChatMessage;
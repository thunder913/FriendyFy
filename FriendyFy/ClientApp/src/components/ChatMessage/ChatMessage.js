import React from "react";
import moment from "moment";

function ChatMessage({message}) {
    function getTime(time){
        let timeFormat = 'HH:mm ' + moment.localeData().longDateFormat('L');
        let testDateUtc = moment.utc(time);
        let localDate = testDateUtc.local();
        return localDate.format(timeFormat);
    }

    if (message.isYourMessage) {
        return (<section>
            <div className={"chat-message clearfix your-message" + (!message.isBottomMessage ? " message-no-bottom-margin" : '')}>
                <div className="chat-message-content clearfix">
                    <header>
                    {message.isTopMessage ? <h5>You</h5> : ''}
                    </header>
                    <p className={
                    !message.isTopMessage && !message.isBottomMessage 
                    ? "top-left-radius bottom-left-radius" : 
                    ((message.isTopMessage ? "top-left-radius" : "") 
                    + " " + 
                    (message.isBottomMessage ? "bottom-left-radius" : "")) } 
                    title={getTime(message.date)}>{message.message}</p>
                </div>
            </div>
        </section>)
    }

    return (<section><div className={"chat-message clearfix other-user-message" + (!message.isBottomMessage ? " message-no-bottom-margin" : '')}>
        <div className="other-user-chat-image">
            {message.isBottomMessage ? <img src={message.photo} alt="" width="32" height="32" /> : ''}
            
        </div>
        <div className="chat-message-content clearfix">
            <header>
            {message.isTopMessage ? <h5>{message.name}</h5> : ''}
            </header>
            <p className={
                !message.isTopMessage && !message.isBottomMessage
                ? "top-right-radius bottom-right-radius" :
                ((message.isTopMessage ? "top-right-radius" : "")
                + " " + 
                (message.isBottomMessage ? "bottom-right-radius" : "")) } title={getTime(message.date)}>{message.message}</p>
        </div>
    </div>
    </section>)
}

export default ChatMessage;
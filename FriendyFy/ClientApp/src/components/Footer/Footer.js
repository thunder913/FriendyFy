import React, { useEffect, useState } from 'react';
import './Footer.css';
import UserChatHeadFooter from '../UserChatHeadFooter/UserChatHeadFooter'
import FriendSearchBar from '../FriendSearchBar/FriendSearchBar';
import { getChats } from '../../services/chatService';
import { useLoggedIn } from '../../contexts/LoggedInContext';
import { HttpTransportType, HubConnectionBuilder } from "@microsoft/signalr";

function Footer(){

    const [chats, setChats] = useState([]);
    const {loggedIn} = useLoggedIn();
    const [connection, setConnection] = useState(null);

    useEffect(()=>{
        document.getElementsByClassName('site-footer')[0].addEventListener('mousewheel', function(e) {
            this.scrollLeft -= (e.wheelDelta*5);
            e.preventDefault();
          }, false);
    })

    useEffect(() => {
        setConnection(new HubConnectionBuilder()
          .withUrl("/chat")
          .withAutomaticReconnect()
          .build());
      }, []);

    useEffect(() => {
      if(connection){
        console.log(connection, "before")
        connection.start().then(() => console.log('started')).catch(err => console.log(err, 'error initializeing'));
        console.log(connection, "after")
      }
    }, [connection])

    useEffect(() => {
        getChats(loggedIn.userName)
            .then(async res => setChats(await res.json()));
    }, [])

    return (
        <div className="site-footer" >
                <FriendSearchBar />
                {chats.map(chat => <UserChatHeadFooter key={chat.chatId} connection={connection} chatDetails={chat}/>)}
        </div>
        )
}



export default Footer;
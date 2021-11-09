import React, { useEffect, useState } from 'react';
import './Footer.css';
import UserChatHeadFooter from '../UserChatHeadFooter/UserChatHeadFooter'
import FriendSearchBar from '../FriendSearchBar/FriendSearchBar';
import { getChats } from '../../services/chatService';
import { useLoggedIn } from '../../contexts/LoggedInContext';
import { HubConnectionBuilder } from "@microsoft/signalr";

function Footer(){

    const [chats, setChats] = useState([]);
    const {loggedIn} = useLoggedIn();
    const [connection, setConnection] = useState(null);

    useEffect(()=>{
        document.getElementsByClassName('site-footer-wrapper')[0].addEventListener('mousewheel', function(e) {
          if(e.target.closest('.live-chat') == null){
            this.scrollLeft -= (e.wheelDelta*5);
            e.preventDefault();
          }
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
        connection.start();
      }
    }, [connection])

    useEffect(() => {
        getChats(loggedIn.userName)
            .then(async res => setChats(await res.json()));
          }, [loggedIn.userName])

    return (
        <div className="site-footer" >
          <div className="site-footer-wrapper">
            <FriendSearchBar />
                {chats.map(chat => <UserChatHeadFooter key={chat.chatId} connection={connection} chatDetails={chat}/>)}
          </div>
        </div>
        )
}



export default Footer;
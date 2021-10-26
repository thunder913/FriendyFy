import React, { useEffect, useState } from 'react';
import './Footer.css';
import UserChatHeadFooter from '../UserChatHeadFooter/UserChatHeadFooter'
import FriendSearchBar from '../FriendSearchBar/FriendSearchBar';
import { getChats } from '../../services/chatService';
import { useLoggedIn } from '../../contexts/LoggedInContext';
import { HubConnection, HubConnectionBuilder } from "@microsoft/signalr";

function Footer(){

    const [chats, setChats] = useState([]);
    const {loggedIn} = useLoggedIn();
    const [connection, setConnection] = useState<null | HubConnection>(null);

    useEffect(()=>{
        document.getElementsByClassName('site-footer')[0].addEventListener('mousewheel', function(e) {
            this.scrollLeft -= (e.wheelDelta*5);
            e.preventDefault();
          }, false);
    })

    useEffect(() => {
        const connect = new HubConnectionBuilder()
          .withUrl("/hubs/chat")
          .withAutomaticReconnect()
          .build();
    });

    useEffect(() => {
        getChats(loggedIn.userName)
            .then(async res => console.log(setChats(await res.json())));
    }, [])

  useEffect(() => {
    if (connection) {
      connection
        .start()
        .then(() => {
          connection.on("ReceiveMessage", (message) => {
          });
        })
        .catch((error) => console.log(error));
    }
  }, [connection]);

  useEffect(async () => {
    await sendMessage();
  })
  const sendMessage = async () => {
    if (connection) await connection.send("SendMessage", "test123");
  };

    return (
        <div className="site-footer">
                <FriendSearchBar />
                {chats.map(chat => <UserChatHeadFooter key={chat.chatId} chat={chat}/>)}
        </div>
        )
}



export default Footer;
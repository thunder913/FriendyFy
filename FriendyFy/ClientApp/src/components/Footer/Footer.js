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
    const [connection, setConnection] = useState(null);

    useEffect(()=>{
        document.getElementsByClassName('site-footer')[0].addEventListener('mousewheel', function(e) {
            this.scrollLeft -= (e.wheelDelta*5);
            e.preventDefault();
          }, false);
    })

    useEffect(() => {
        const connect = new HubConnectionBuilder()
          .withUrl("/chat")
          .withAutomaticReconnect()
          .build();
        setConnection(connect);
    }, []);

    useEffect(() => {
        getChats(loggedIn.userName)
            .then(async res => setChats(await res.json()));
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

  const sendMessage = async () => {
      console.log(connection);
    if (connection) await connection.send("SendMessage", "test123");
  };

    return (
        <div className="site-footer" >
            <button onClick={sendMessage}>BUTTON</button>
                <FriendSearchBar />
                {chats.map(chat => <UserChatHeadFooter key={chat.chatId} chat={chat}/>)}
        </div>
        )
}



export default Footer;
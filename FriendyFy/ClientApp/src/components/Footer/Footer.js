import React, { useEffect, useState } from 'react';
import './Footer.css';
import UserChatHeadFooter from '../UserChatHeadFooter/UserChatHeadFooter'
import FriendSearchBar from '../FriendSearchBar/FriendSearchBar';
import { getChats } from '../../services/chatService';
import { useLoggedIn } from '../../contexts/LoggedInContext';
function Footer(){

    const [chats, setChats] = useState([]);
    const {loggedIn} = useLoggedIn();

    useEffect(()=>{
        document.getElementsByClassName('site-footer')[0].addEventListener('mousewheel', function(e) {
            this.scrollLeft -= (e.wheelDelta*5);
            e.preventDefault();
          }, false);
    })

    useEffect(() => {
        console.log("IN")
        getChats(loggedIn.userName)
            .then(async res => console.log(setChats(await res.json())));
    }, [])

    return (
        <div className="site-footer">
                <FriendSearchBar />
                {chats.map(chat => <UserChatHeadFooter key={chat.chatId} chat={chat}/>)}
        </div>
        )
}



export default Footer;
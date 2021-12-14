import React, { useEffect, useState } from 'react';
import './Footer.css';
import UserChatHeadFooter from '../UserChatHeadFooter/UserChatHeadFooter'
import FriendSearchBar from '../FriendSearchBar/FriendSearchBar';
import { getChats } from '../../services/chatService';
import { useLoggedIn } from '../../contexts/LoggedInContext';
import { faArrowCircleLeft, faArrowCircleRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

function Footer() {
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState('')
  const [chats, setChats] = useState([]);
  const { loggedIn } = useLoggedIn();

  const changePage = (num) => {
    let newPage = page+num;
    if(newPage < 0){
      newPage = 0;
    }
    setPage(newPage);
  }

  const performSearch = (e) => {
    e.preventDefault();
  }

  useEffect(() => {
    document.getElementsByClassName('site-footer-wrapper')[0].addEventListener('mousewheel', function (e) {
      if (e.target.closest('.live-chat') == null) {
        this.scrollLeft -= (e.wheelDelta * 5);
        e.preventDefault();
      }
    }, false);
  })

  useEffect(() => {
    // almost done, send the chat Ids in the query
    // and calculate how many to get
    let take = parseInt((window.innerWidth - 200) / 300);
    getChats(loggedIn.userName, page, take, search, take)
      .then(async res => {
        setChats(await res.json())
      });
  }, [loggedIn.userName, page])

  return (
    <div className="site-footer" >
      <div className="site-footer-wrapper">
        <FriendSearchBar setSearch={setSearch} performSearch={performSearch} />
        {page > 0 ? <FontAwesomeIcon className="left-arrow" icon={faArrowCircleLeft} onClick={() => changePage(-1)}/> : ''}
        <div className="chats">
          {chats.map(chat => <UserChatHeadFooter key={chat.chatId} chatDetails={chat} chats={chats} setChats={setChats}/>)}
        </div>
        <FontAwesomeIcon className="right-arrow" icon={faArrowCircleRight} onClick={() => changePage(1)}/>
      </div>
    </div>
  )
}



export default Footer;
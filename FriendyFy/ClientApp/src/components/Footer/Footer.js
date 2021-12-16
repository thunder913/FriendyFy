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
  const [hasMore, setHasMore] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const changePage = (num) => {
    let newPage = page + num;
    if (newPage < 0) {
      newPage = 0;
    }
    setPage(newPage);
  }

  const searchFriends = (hasSearchWord) => {
    let openedChats = chats.filter(c => c.isActive);
    let chatIds = openedChats.map(c => c.chatId);
    let itemsPerPage = parseInt((window.innerWidth - 200) / 300);

    getChats(loggedIn.userName, page, itemsPerPage - openedChats.length, hasSearchWord ? search : '', itemsPerPage, JSON.stringify(chatIds))
      .then(async res => {
        let obj = await res.json();
        if (obj.length === 0 && !hasSearchWord) {
          setHasMore(false);
        } else if (obj.length === 0 && hasSearchWord) {
          setHasMore(false);
          setChats([...openedChats]);
        }
        else {
          setHasMore(true);
          let newChats = [...openedChats, ...obj];
          setChats(newChats)
          if (obj.length < itemsPerPage - openedChats.length) {
            setHasMore(false);
          }
        }
      });
  }
  const performSearch = (e) => {
    e.preventDefault();
    setIsSearching(true);
    if(page === 0){
      searchFriends(true);
    }else{
      setPage(0);
    }
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
    if (!search) {
      setIsSearching(false);
    }
  }, [search])

  useEffect(() => {
    searchFriends(isSearching);
  }, [loggedIn.userName, page])

  return (
    <div className="site-footer" >
      <div className="site-footer-wrapper fancy-scroll">
        <FriendSearchBar setSearch={setSearch} performSearch={performSearch} />
        {page > 0 ? <FontAwesomeIcon className="left-arrow" icon={faArrowCircleLeft} onClick={() => changePage(-1)} /> : ''}
        <div className="chats">
          {chats.map(chat => <UserChatHeadFooter key={chat.chatId} chatDetails={chat} chats={chats} setChats={setChats} />)}
        </div>
        {hasMore ? <FontAwesomeIcon className="right-arrow" icon={faArrowCircleRight} onClick={() => changePage(1)} /> : ''}
      </div>
    </div>
  )
}



export default Footer;
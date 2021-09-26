import React, { useEffect } from 'react';
import './Footer.css';
import UserChatHeadFooter from '../UserChatHeadFooter/UserChatHeadFooter'
import FriendSearchBar from '../FriendSearchBar/FriendSearchBar';

function Footer(props){
    useEffect(()=>{
        document.getElementsByClassName('site-footer')[0].addEventListener('mousewheel', function(e) {
            this.scrollLeft -= (e.wheelDelta*5);
            e.preventDefault();
          }, false);
    })

    return (
        <div className="site-footer">
                <FriendSearchBar />
                {props.people.map(person => <UserChatHeadFooter person={person}/>)}
        </div>
        )
}



export default Footer;
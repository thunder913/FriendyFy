import React from 'react';
import './Footer.css';
import UserChatHeadFooter from '../UserChatHeadFooter/UserChatHeadFooter'

function Footer(props){
    return (
        <div className="site-footer">
            {props.people.map(person => <UserChatHeadFooter person={person}/>)}
        </div>
        )
}

export default Footer;
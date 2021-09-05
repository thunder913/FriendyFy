import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBell } from '@fortawesome/free-solid-svg-icons'
import './UserHeader.css';

const UserHeader = () =>(
    <div className="user-info">
        <div className="user-image">
            <img src={require("../../testPhoto.jpg")} alt="" />
        </div>
        <span className="user-name">
            Andon
        </span>
    </div>
    )

export default UserHeader;
import React from 'react';
import './UserHeader.css';
import {useLoggedIn} from '../../contexts/LoggedInContext.js';
import { Link } from 'react-router-dom';
const UserHeader = () =>{
    const {loggedIn} = useLoggedIn();

    return (
    <Link to={'/profile/' + loggedIn.userName}>
        <div className="user-info" >
            <div className="user-image">
                <img src={loggedIn.profilePhoto} alt="" />
            </div>
            <span className="user-name">
                {loggedIn.firstName}
            </span>
        </div>
    </Link>)
}

export default UserHeader;
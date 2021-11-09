import React from 'react';
import './UserHeader.css';
import { useHistory } from 'react-router';
import {useLoggedIn} from '../../contexts/LoggedInContext.js';

const UserHeader = () =>{
    const {loggedIn} = useLoggedIn();
    const history = useHistory();

    const goToProfile = () => {
            history.push('/profile/' + loggedIn.userName);
    }

    return (<div className="user-info" onClick={goToProfile}>
        <div className="user-image">
            <img src={loggedIn.profilePhoto} alt="" />
        </div>
        <span className="user-name">
            {loggedIn.firstName}
        </span>
    </div>)
}

export default UserHeader;
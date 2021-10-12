import React from 'react';
import './UserHeader.css';
import { useHistory } from 'react-router';
import {useLoggedIn} from '../../contexts/LoggedInContext.js'

const UserHeader = () =>{
    const {loggedIn, setLoggedIn} = useLoggedIn();
    const history = useHistory();
    const goToProfile = () => {
        console.log(loggedIn);
        history.push('profile/' + loggedIn.userName);
    }

    return (<div className="user-info" onClick={goToProfile}>
        <div className="user-image">
            <img src={require("../../testPhoto.jpg")} alt="" />
        </div>
        <span className="user-name">
                Andon
        </span>
    </div>)
}

export default UserHeader;
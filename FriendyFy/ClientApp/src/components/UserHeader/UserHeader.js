import React from 'react';
import './UserHeader.css';
import { useHistory } from 'react-router';

const UserHeader = () =>{

    const history = useHistory();
    const goToProfile = () => {
        history.push('profile');
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
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUserTie } from '@fortawesome/free-solid-svg-icons'
import './UserOptions.css';

const UserOptions = () =>(
    <div className="user-options circle-right">
        <FontAwesomeIcon icon={faUserTie} />
    </div>
    )

export default UserOptions;
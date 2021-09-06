import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUserCog } from '@fortawesome/free-solid-svg-icons'
import './UserOptions.css';

const UserOptions = () =>(
    <div className="user-options circle-right">
        <FontAwesomeIcon icon={faUserCog} />
    </div>
    )

export default UserOptions;
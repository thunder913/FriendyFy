import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBell } from '@fortawesome/free-solid-svg-icons'
import './Notifications.css';

const Notifications = () =>(
    <div className="notifications circle-right">
        <FontAwesomeIcon icon={faBell} />
    </div>
    )

export default Notifications;
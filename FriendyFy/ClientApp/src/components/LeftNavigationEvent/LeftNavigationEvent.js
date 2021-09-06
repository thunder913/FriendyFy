import React from 'react';
import './LeftNavigationEvent.css';

const LeftNavigationEvent = ({data}) =>(
        <div className="event">
            <h4>{data.name}</h4>
            <span>{data.location}</span>
            <span>{data.time}</span>
            <span>Interests: {data.interests.join(', ')}</span>
            <div className="attendingUsers">
                {data.attending.map(user => (
                    <div className="attending-user">
                        <div className="attending-user-photo">
                            <img src={user.photo} alt="" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )

export default LeftNavigationEvent;
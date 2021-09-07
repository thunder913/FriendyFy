import React from 'react';
import LeftNavigationEvent from '../LeftNavigationEvent/LeftNavigationEvent';
import './LeftNavigationEvents.css';

const LeftNavigationEvents = ({events}) =>(
    <div className="events">
        {events.map(event => (
            <div className="event-row">
            <h3 className="event-tab-title">{event.title}</h3>
            <div className="event-tab">
                {event.events.map(data => <LeftNavigationEvent data={data}/>)}
            </div>
            </div>
            ))}
    </div>
    )

export default LeftNavigationEvents;
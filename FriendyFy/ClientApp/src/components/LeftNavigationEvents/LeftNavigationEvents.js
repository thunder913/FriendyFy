import React from 'react';
import LeftNavigationEvent from '../LeftNavigationEvent/LeftNavigationEvent';
import './LeftNavigationEvents.css';

const LeftNavigationEvents = ({events}) =>(
    <div className="events">
        
        {events.attendingEvents ? 
            <div className="event-row">
            <h3 className="event-tab-title">Attending</h3>
            <div className="event-tab">
                {events.attendingEvents.map(event => <LeftNavigationEvent key={event.id} data={event}/>)}
            </div>
            </div>
            : ''}
        {events.organizedEvents ?
            <div className="event-row">
            <h3 className="event-tab-title">Suggested</h3>
            <div className="event-tab">
                {events.organizedEvents.map(event => <LeftNavigationEvent key={event.id} data={event}/>)}
            </div>
            </div>
            : ''}
        {events.suggestedEvents ?
            <div className="event-row">
            <h3 className="event-tab-title">Organized</h3>
            <div className="event-tab">
                {events.suggestedEvents.map(event => <LeftNavigationEvent key={event.id} data={event}/>)}
            </div>
            </div>
            : ''}
    </div>
    )

export default LeftNavigationEvents;
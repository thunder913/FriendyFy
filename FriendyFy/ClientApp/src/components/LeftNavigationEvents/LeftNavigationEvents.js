import React from 'react';
import LeftNavigationEvent from '../LeftNavigationEvent/LeftNavigationEvent';
import './LeftNavigationEvents.css';

const LeftNavigationEvents = ({events, setBlockNavScroll}) =>(
    <div className="events">
        
        {events.attendingEvents && events.attendingEvents.length ? 
            <div className={"event-row " + (events.attendingEvents.length === 1 ? 'h-1' : 'h-2')}>
            <h3 className="event-tab-title">Attending</h3>
            <div className="event-tab">
                {events.attendingEvents.map(event => <LeftNavigationEvent setBlockNavScroll={setBlockNavScroll} key={event.id} data={event}/>)}
            </div>
            </div>
            : ''}
        {events.suggestedEvents && events.suggestedEvents.length ?
            <div className={"event-row " + (events.suggestedEvents.length === 1 ? 'h-1' : 'h-2')}>
            <h3 className="event-tab-title">Suggested</h3>
            <div className="event-tab">
                {events.suggestedEvents.map(event => <LeftNavigationEvent setBlockNavScroll={setBlockNavScroll} key={event.id} data={event}/>)}
            </div>
            </div>
            : ''}
        {events.organizedEvents && events.organizedEvents.length ?
            <div className={"event-row " + (events.organizedEvents.length === 1 ? 'h-1' : 'h-2')}>
            <h3 className="event-tab-title">Organized</h3>
            <div className="event-tab">
                {events.organizedEvents.map(event => <LeftNavigationEvent setBlockNavScroll={setBlockNavScroll} key={event.id} data={event}/>)}
            </div>
            </div>
            : ''}
    </div>
    )

export default LeftNavigationEvents;
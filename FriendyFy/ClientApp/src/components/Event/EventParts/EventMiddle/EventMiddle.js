import React, { useEffect, useState } from 'react'
import { joinEvent, shareEvent } from '../../../../services/eventService'
import {NotificationContainer, NotificationManager} from 'react-notifications';
import { useHistory } from 'react-router';
import 'react-notifications/lib/notifications.css';
import './EventMiddle.css'

const EventMiddle = ({eventId, title, privacy, interests=[], organizerName, organizerUsername, isInEvent, isOrganizer, setIsInEvent}) => {
    const [isUserInEvent, setIsUserInEvent] = useState(isInEvent);
    const history = useHistory();
    const joinEventHandler = () => {
        joinEvent(eventId)
            .then(res => {
                if(res.status === 200){
                    NotificationManager.success('Successfully joined the event!', '', 2000);
                    setIsUserInEvent(true);
                    setIsInEvent(true);
                }else{
                    NotificationManager.error('There was an error joining the event!', '', 2000);
                    setIsUserInEvent(false);
                }
            })
    }

    const inviteEventHandler = () => {
        NotificationManager.success('Successfully joined the event!', '', 2000);
        NotificationManager.error('There was an error joining the event!');
        
    }

    const shareEventHandler = () => {
        shareEvent(eventId)
            .then(res => {
                if(res.status === 200){
                    NotificationManager.success('Successfully shared the event in your feed!', '', 2000);
                }else{
                    NotificationManager.error("There was an error sharing the event!, try again", '', 3000)
                }
            })
    }

    const goToOrganizerProfil = () => {
        history.push('/profile/' + organizerUsername);
    }

    useEffect(() => {
        setIsUserInEvent(isInEvent);
    }, [isInEvent])

    return(
            <section className="event-page-middle">
                <NotificationContainer/>
                <div className="left-side">
                    <h2 className="event-title">{title}</h2>
                    <div className="other-info">
                    <p className="event-privacy">{privacy}</p>
                    {/* <p className="reocurring">{isReocurring ? reocurringTime : ''}</p> */}
                    </div>
                </div>
                <div className="middle">
                    <div className="interests">
                        {interests.map(interest => <span className="user-interest" key={interest.id} data-id={interest.id}>{interest.label}</span>)}
                    </div>
                </div>
                <div className="right-side">
                    <p className="organized-text">organized by:</p>
                    <h3 className="organizer-name" onClick={goToOrganizerProfil}>{isOrganizer ? 'you' : organizerName}</h3>
                    <div className="buttons">
                        {!isUserInEvent ? 
                        <button className="join" onClick={joinEventHandler}>Join</button> :
                        <button className="invite" onClick={inviteEventHandler}>Invite</button>}
                        <button className="share" onClick={shareEventHandler}>Share</button>
                    </div> 
                </div>
            </section>
    )
}

export default EventMiddle;
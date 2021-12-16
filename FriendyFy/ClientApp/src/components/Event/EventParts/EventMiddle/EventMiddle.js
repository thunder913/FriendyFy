import React, { useEffect, useState } from 'react'
import { joinEvent, shareEvent } from '../../../../services/eventService'
import { NotificationManager } from 'react-notifications';
import 'react-notifications/lib/notifications.css';
import './EventMiddle.css'
import { Link } from 'react-router-dom';
import InvitePeoplePopUp from '../../../PopUps/InvitePeoplePopUp/InvitePeoplePopUp';

const EventMiddle = ({ eventId, title, privacy, interests = [], organizerName, organizerUsername, isInEvent, isOrganizer, setIsInEvent }) => {
    const [isUserInEvent, setIsUserInEvent] = useState(isInEvent);
    const [show, setShow] = useState(false);
    const joinEventHandler = () => {
        joinEvent(eventId)
            .then(res => {
                if (res.status === 200) {
                    NotificationManager.success('Successfully joined the event!', '', 2000);
                    setIsUserInEvent(true);
                    setIsInEvent(true);
                } else {
                    NotificationManager.error('There was an error joining the event!', '', 2000);
                    setIsUserInEvent(false);
                }
            })
    }

    const shareEventHandler = () => {
        shareEvent(eventId)
            .then(res => {
                if (res.status === 200) {
                    NotificationManager.success('Successfully shared the event in your feed!', '', 2000);
                } else {
                    NotificationManager.error("There was an error sharing the event!, try again", '', 3000)
                }
            })
    }

    useEffect(() => {
        setIsUserInEvent(isInEvent);
    }, [isInEvent])

    return (
        <section className="event-page-middle">
            <InvitePeoplePopUp title='Invite your friends' eventId={eventId} show={show} setShow={setShow} />
            <div className="left-side">
                <h2 className="event-title">{title}</h2>
                <div className="other-info">
                    <p className="event-privacy">{privacy}</p>
                    {/* <p className="reocurring">{isReocurring ? reocurringTime : ''}</p> */}
                </div>
            </div>
            <div className="middle">
                <div className="interests">
                    {interests.map(interest => <Link to={`/search-page?interests=[{"label":"${interest.label}","value":${interest.id}}]`} className="user-interest" key={interest.id} data-id={interest.id}>{interest.label}</Link>)}
                </div>
            </div>
            <div className="right-side">
                <p className="organized-text">organized by:</p>
                <Link to={'/profile/' + organizerUsername}><h3 className="organizer-name">{isOrganizer ? 'you' : organizerName}</h3></Link>
                <div className="buttons">
                    {!isUserInEvent ?
                        <button className="join" onClick={joinEventHandler}>Join</button> :
                        <button className="invite" onClick={() => setShow(true)}>Invite</button>}
                    <button className="share" onClick={shareEventHandler}>Share</button>
                </div>
            </div>
        </section>
    )
}

export default EventMiddle;
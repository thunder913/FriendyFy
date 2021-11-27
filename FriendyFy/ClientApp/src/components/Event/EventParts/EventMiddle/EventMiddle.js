import React, { useEffect } from 'react'
import './EventMiddle.css'

const EventMiddle = ({title, privacy, isReocurring, reocurringTime, interests=[], organizerName, organizerUsername, isInEvent, isOrganizer}) => {
    return(
            <section className="event-page-middle">
                <div className="left-side">
                    <h2 className="event-title">{title}</h2>
                    <div className="other-info">
                    <p className="event-privacy">{privacy}</p>
                    <p className="reocurring">{isReocurring ? reocurringTime : ''}</p>
                    </div>
                </div>
                <div className="middle">
                    <div className="interests">
                        {interests.map(interest => <span className="user-interest" key={interest.id} data-id={interest.id}>{interest.label}</span>)}
                    </div>
                </div>
                <div className="right-side">
                    <p className="organized-text">organized by:</p>
                    <h3 className="organizer-name">{isOrganizer ? 'you' : organizerName}</h3>
                    <div className="buttons">
                        <button className="invite">Invite</button>
                        <button className="share">Share</button>
                    </div>
                </div>
            </section>
    )
}

export default EventMiddle;
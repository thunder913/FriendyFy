import React from 'react'
import './EventMiddle.css'

const EventMiddle = () => {
    const interests = [{id: 'drinking', label: 'Drinking'}, {id: 'driving', label: 'Driving'}, {id: 'fitness', label: 'Fitness'}, {id: 'drinking', label: 'Drinking'}, {id: 'driving', label: 'Driving'}, {id: 'fitness', label: 'Fitness'}]
    return(
            <section className="event-page-middle">
                <div className="left-side">
                    <h2 className="event-title">Partying with ivan</h2>
                    <div className="other-info">
                    <p className="event-privacy">Private</p>
                    <p className="reocurring">Weekly</p>
                    </div>
                </div>
                <div className="middle">
                    <div className="interests">
                        {interests.map(interest => <span className="user-interest" key={interest.id} data-id={interest.id}>{interest.label}</span>)}
                    </div>
                </div>
                <div className="right-side">
                    <p className="organized-text">organized by:</p>
                    <h3 className="organizer-name">Andon Gorchov</h3>
                    <div className="buttons">
                        <button className="invite">Invite</button>
                        <button className="share">Share</button>
                    </div>
                </div>
            </section>
    )
}

export default EventMiddle;
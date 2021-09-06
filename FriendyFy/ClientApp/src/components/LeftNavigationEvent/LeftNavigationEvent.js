import React from 'react';
import './LeftNavigationEvent.css';

const LeftNavigationEvent = ({data}) =>(
        <div className="event">
            <header class="event-header">
                <h4>{data.name}</h4>
                <span>{data.time}</span>
            </header>
            <main className="event-card">
            <div className="left-side">
                <span>{data.location}</span>
                <section className="interests">
                    {data.interests.map(interest => (<div class="interest">{interest}</div>))}
                </section>
            </div>
            <div className="rigt-side">
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
            </main>
        </div>
    )

export default LeftNavigationEvent;
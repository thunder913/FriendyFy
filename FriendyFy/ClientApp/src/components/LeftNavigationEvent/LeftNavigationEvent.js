import React from 'react';
import './LeftNavigationEvent.css';

const LeftNavigationEvent = ({data}) =>(
        <div className="event">
            <div className="line-parent">
                <div className="line"></div>
            </div>
            <header className="event-header">
                <h4>{data.name}</h4>
                <div className="event-information">
                    <span className="location"><a href="/">{data.location}</a></span>
                    <span>{data.time}</span>
                </div>
            </header>
            <main className="event-card">
            <div className="left-side">
                <section className="interests">
                    {data.interests.map(interest => (<div key={interest.id} className="interest">{interest.label}</div>))}
                </section>
            </div>
            <div className="right-side">
            <div className={"attendingUsers "+getImageWidthClassName(data.goingPhotos.length)}>
                {data.goingPhotos ? data.goingPhotos.map(user => (
                    <div key={user} className="attending-user">
                        <div className="attending-user-photo">
                            <img src={user} alt="" />
                        </div>
                    </div>
                )): ''}
            </div>
            <button>View</button>
            </div>
            </main>
        </div>
    )

function getImageWidthClassName(count){
    if (count===1) {
        return "w-1";
    }else if (count===2) {
        return "w-2";
    }
    else if (count <= 4) {
        return "w-3";
    }
    else if (count <= 8) {
        return "w-4";
    }
}

export default LeftNavigationEvent;
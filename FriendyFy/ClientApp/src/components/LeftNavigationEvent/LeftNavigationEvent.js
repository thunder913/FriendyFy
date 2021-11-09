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
                    <span>next month</span>
                </div>
            </header>
            <main className="event-card">
            <div className="left-side">
                <section className="interests">
                    {data.interests.map(interest => (<div className="interest">{interest}</div>))}
                </section>
            </div>
            <div className="right-side">
            <div className={"attendingUsers "+getImageWidthClassName(data.attending.length)}>
                {data.attending.map(user => (
                    <div className="attending-user">
                        <div className="attending-user-photo">
                            <img src={user.photo} alt="" />
                        </div>
                    </div>
                ))}
            </div>
            <button>Text</button>
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
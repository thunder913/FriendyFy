import React from "react";
import './Event.css'
import EventOneImage from "./EventImages/EventOneImage";

const Event = () => {
    const images = ['https://cdn.pixabay.com/photo/2017/07/21/23/57/concert-2527495__480.jpg']
    return(
        <article className="event-page">
            <section className="event-page-top">
                <div className="photos">
                    <EventOneImage image={images[0]}/>
                </div>
                <div className="middle">
                    <div className="image">
                        <img src={images[0]} alt="" />
                    </div>
                </div>
                <div className="location-time">
                    Location is here!!!!!!
                </div>
            </section>
        </article>
    )
}

export default Event;
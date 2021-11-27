import React, { useEffect } from "react";
import './Event.css'
import EventDetails from "./EventParts/EventDetails/EventDetails";
import EventMiddle from "./EventParts/EventMiddle/EventMiddle";
import './EventParts/EventTop/EventTop'
import EventTop from "./EventParts/EventTop/EventTop";

const Event = () => {
    const eventId = decodeURI(window.location.href.substring(window.location.href.lastIndexOf('/')+1));

    useEffect(() => {
        console.log(eventId);
    }, [])

    return(
        <article className="event-page">
            <EventTop/>
            <EventMiddle/>
            <EventDetails/>
        </article>
    )
}

export default Event;
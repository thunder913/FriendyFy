import React, { useEffect, useState } from "react";
import { getEventById } from "../../services/eventService";
import './Event.css'
import EventDetails from "./EventParts/EventDetails/EventDetails";
import EventMiddle from "./EventParts/EventMiddle/EventMiddle";
import './EventParts/EventTop/EventTop'
import EventTop from "./EventParts/EventTop/EventTop";
import { useHistory } from "react-router";

const Event = () => {
    const history = useHistory();
    const eventId = decodeURI(window.location.href.substring(window.location.href.lastIndexOf('/')+1));
    const [event, setEvent] = useState({});
    const [isInEvent, setIsInEvent] = useState(event.isInEvent);
    useEffect(() => {
        getEventById(eventId)
            .then(async res => {
                let obj = await res.json();
                setEvent(obj);
                setIsInEvent(obj.isInEvent);
            });
    }, [history.location])

    return(
        <article className="event-page">
            <EventTop 
                images={event.photos}
                mainImage={event.mainPhoto}
                lat={event.lat}
                lng={event.lng}
                city={event.city}
                time={event.time}
                userImages={event.userImages}
                isOrganizer={event.isOrganizer}
                eventId={eventId}
                setIsInEvent={setIsInEvent}
                isInEvent={isInEvent}
                />
            <EventMiddle
                eventId = {eventId}
                title={event.title}
                privacy={event.privacy}
                // isReocurring={event.isReocurring}
                // reocurringTime={event.reocurringTime}
                interests={event.interests}
                organizerName={event.organizer}
                organizerUsername={event.organizerUsername}
                isInEvent={isInEvent}
                setIsInEvent={setIsInEvent}
                isOrganizer={event.isOrganizer}
            />
            <EventDetails
                description={event.description}
                createdOn={event.createdOn}
                organizer={event.organizer}
                isOrganizer={event.isOrganizer}
            />
        </article>
    )
}

export default Event;
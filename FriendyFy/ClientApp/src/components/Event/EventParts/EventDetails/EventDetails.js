import React, { useEffect, useState } from "react";
import './EventDetails.css'
import moment from "moment-timezone";
const EventDetails = ({description, createdOn, organizer, isOrganizer}) => {
    const [localTime, setLocalTime] = useState('');
    useEffect(() => {
        let localization = window.navigator.userLanguage || window.navigator.language;
        moment.locale(localization);
        let utcTime = moment.utc(createdOn);
        setLocalTime(utcTime.local().format('LLL'))
    }, [createdOn])

    return(<section className="event-details">
    <div className="description">
        <p className="description-label">Description:</p>
        <p className="description-text">{description}</p>
        </div>
    <p className="organized">This event was organized on {localTime} by {isOrganizer ? 'you' : organizer}.</p>
</section>)
}

export default EventDetails;
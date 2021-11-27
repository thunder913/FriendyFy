import React from "react";
import './EventDetails.css'
const EventDetails = ({description, createdOn, organizer}) => {
    return(<section className="event-details">
    <div className="description">
        <p className="description-label">Description:</p>
        <p className="description-text">{description}</p>
        </div>
    <p className="organized">This event was organized on {createdOn} by {organizer}</p>
</section>)
}

export default EventDetails;
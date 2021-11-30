import React, { useEffect, useState } from "react";
import './EventTop.css'
import MyGoogleMap from "../../../GoogleMap/MyGoogleMap";
import EventOneImage from "../../EventImages/EventOneImage/EventOneImage";
import EventTwoImages from "../../EventImages/EventTwoImages/EventTwoImages";
import EventThreeImages from "../../EventImages/EventThreeImages/EventThreeImages";
import moment from "moment-timezone";
import AddImagePopUp from "../../../AddImagePopUp/AddImagePopUp";
import { leaveEvent } from "../../../../services/eventService";
const EventTop = ({images=[], mainImage, lat, lng, city, time, userImages=[], isOrganizer, eventId, isInEvent}) => {
    const [localTime, setLocalTime] = useState('');
    const [eventTime,] = useState(time);
    const [showAddImagePopUp, setShowAddImagePopUp] = useState(false);
    const [eventImages, setEventImages] = useState([]);

    const closeImagePopUp = () => {
        setShowAddImagePopUp(false);
    }

    const openImagePopUp = () => {
        setShowAddImagePopUp(true);
    }

    const leaveEventHandler = () => {
        leaveEvent(eventId)
            .then(async res =>{
                if(res === 200){
                    isInEvent = false;
                }
            })
    }

    useEffect(() => {
        setEventImages(images);
    }, [images])

    useEffect(() => {
        let localization = window.navigator.userLanguage || window.navigator.language;
        moment.locale(localization);
        let utcTime = moment.utc(time);
        setLocalTime(utcTime.local().format('LLL'))
    }, [eventTime])

return(<section className="event-page-top">
                {showAddImagePopUp ? <AddImagePopUp setImages={setEventImages} eventId={eventId} closePopUp={closeImagePopUp}/> : ''}
                {isInEvent ? <button className="leave-button" onClick={leaveEventHandler}>Leave</button> : ''}
                <div className="photos">
                    {eventImages.length === 0 && isOrganizer ? <div className="add-image">
                        <button onClick={openImagePopUp} className="big-add-image">Add Image</button>
                    </div> : eventImages.length === 1 ? <EventOneImage image={eventImages[0]}/> :
                    eventImages.length === 2 ? <EventTwoImages images={eventImages}/> :
                    eventImages.length === 3 ? <EventThreeImages images={eventImages}/> : ''}
                    {(eventImages.length >= 1 && eventImages.length < 3 && isOrganizer) ? 
                    <button className="add-event-image" onClick={openImagePopUp}>Add Image</button>
                    : ''}
                </div>
                <div className="middle">
                    <div className="image">
                        <div className="main-image">
                            <img src={mainImage} alt="" />
                        </div>
                        <div className="bottom-going">
                        <h2>GOING:</h2>
                        <div className="going-images">
                        {userImages.map(img => <img key={img} className="going-image" src={img} alt="" />)}
                        </div>
                        </div>
                    </div>
                </div>
                <div className="location-time">
                    <MyGoogleMap location={{lat:lat, lng:lng}} staticMap={true}/>
                    <p className="info-text">{city} {localTime}</p>
                </div>
            </section>)
}

export default EventTop;
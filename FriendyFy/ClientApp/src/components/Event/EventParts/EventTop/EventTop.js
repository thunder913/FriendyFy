import React, { useEffect, useState } from "react";
import './EventTop.css'
import MyGoogleMap from "../../../GoogleMap/MyGoogleMap";
import EventOneImage from "../../EventImages/EventOneImage/EventOneImage";
import EventTwoImages from "../../EventImages/EventTwoImages/EventTwoImages";
import EventThreeImages from "../../EventImages/EventThreeImages/EventThreeImages";
import moment from "moment-timezone";
import AddImagePopUp from "../../../PopUps/AddImagePopUp/AddImagePopUp";
import { deleteEvent, leaveEvent } from "../../../../services/eventService";
import { NotificationContainer, NotificationManager } from 'react-notifications';
import ApprovePopUp from "../../../PopUps/ApprovePopUp/ApprovePopUp";
import { useHistory } from "react-router";
import ViewImagePopUp from "../../../PopUps/ViewImagePopUp/ViewImagePopUp";

const EventTop = ({ images = [], mainImage, lat, lng, city, time, userImages = [], isOrganizer, eventId, isInEvent, setIsInEvent }) => {
    const [localTime, setLocalTime] = useState('');
    const [eventTime,] = useState(time);
    const [showAddImagePopUp, setShowAddImagePopUp] = useState(false);
    const [eventImages, setEventImages] = useState([]);
    const [showLeaveEventPopUp, setShowLeaveEventPopUp] = useState(false);
    const [showImagePopUp, setShowImagePopUp] = useState(false);
    const [imagePopUpUrl, setImagePopUpUrl] = useState('');
    const history = useHistory();

    const leaveEventHandler = () => {
        if (isOrganizer) {
            setShowLeaveEventPopUp(true)
            return;
        }
        leaveEvent(eventId)
            .then(async res => {
                if (res.status === 200) {
                    NotificationManager.success('Successfully left the event!', '', 2000);
                    setIsInEvent(false);
                }
            })
    }

    const leaveEventAsOrganizer = () => {
        deleteEvent(eventId)
            .then(res => {
                if (res.status === 200) {
                    history.push('/');
                }
            })
    }

    const showImagePopUpEvent = (imageUrl) => {
        if (imageUrl) {
            setShowImagePopUp(true);
            setImagePopUpUrl({ postImage: imageUrl });
        }
    }

    useEffect(() => {
        setEventImages(images);
    }, [images])

    useEffect(() => {
        let localization = window.navigator.userLanguage || window.navigator.language;
        moment.locale(localization);
        let utcTime = moment.utc(time);
        setLocalTime(utcTime.local().format('LLL'))
    }, [time])

    return (<section className="event-page-top">
        <ViewImagePopUp
            showRightSection={false}
            post={imagePopUpUrl}
            show={showImagePopUp}
            setShow={setShowImagePopUp}/>
        <NotificationContainer />
        <ApprovePopUp
            text="Are you sure you want to delete the event. If you click the Approve button, it will be gone permanently!"
            acceptEvent={leaveEventAsOrganizer}
            show={showLeaveEventPopUp}
            setShow={setShowLeaveEventPopUp} />
        <AddImagePopUp setImages={setEventImages} eventId={eventId} show={showAddImagePopUp} setShow={setShowAddImagePopUp} />
        {isInEvent ? <button className="leave-button" onClick={leaveEventHandler}>Leave</button> : ''}
        <div className={"photos "+(eventImages.length===0?'empty':'')}>
            {eventImages.length === 0 && isOrganizer ? <div className="add-image">
                <button onClick={() => setShowAddImagePopUp(true)} className="big-add-image">Add Image</button>
            </div> : eventImages.length === 1 ? <EventOneImage showImagePopUp={showImagePopUpEvent} image={eventImages[0]} /> :
                eventImages.length === 2 ? <EventTwoImages showImagePopUp={showImagePopUpEvent} images={eventImages} /> :
                    eventImages.length === 3 ? <EventThreeImages showImagePopUp={showImagePopUpEvent} images={eventImages} /> : ''}
            {(eventImages.length >= 1 && eventImages.length < 3 && isOrganizer) ?
                <button className="add-event-image" onClick={() => setShowAddImagePopUp(true)}>Add Image</button>
                : ''}
        </div>
        <div className="middle">
            <div className="image">
                <div onClick={() => showImagePopUpEvent(mainImage)} className="main-image">
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
            {(lat && lng) ? <MyGoogleMap location={{ lat: lat, lng: lng }} staticMap={true} /> : ''}
            <p className="info-text">{city} {localTime}</p>
        </div>
    </section>)
}

export default EventTop;
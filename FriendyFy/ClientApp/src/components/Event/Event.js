import React from "react";
import './Event.css'
import MyGoogleMap from "../GoogleMap/MyGoogleMap";
import EventOneImage from "./EventImages/EventOneImage/EventOneImage";
import EventTwoImages from "./EventImages/EventTwoImages/EventTwoImages";
import EventThreeImages from "./EventImages/EventThreeImages/EventThreeImages";

const Event = () => {
    const images = ['https://cdn.pixabay.com/photo/2017/07/21/23/57/concert-2527495__480.jpg', 'https://cdn.pixabay.com/photo/2017/07/21/23/57/concert-2527495__480.jpg', 'https://media.istockphoto.com/photos/nicelooking-attractive-gorgeous-glamorous-elegant-stylish-cheerful-picture-id1165055006?k=20&m=1165055006&s=612x612&w=0&h=OD4-_BceL_R2eaaBzDQrXNIyydwYXOJX-m-0z12z17s=']
    const mainImage = 'https://media.istockphoto.com/photos/nicelooking-attractive-gorgeous-glamorous-elegant-stylish-cheerful-picture-id1165055006?k=20&m=1165055006&s=612x612&w=0&h=OD4-_BceL_R2eaaBzDQrXNIyydwYXOJX-m-0z12z17s=';
    const interests = [{id: 'drinking', label: 'Drinking'}, {id: 'driving', label: 'Driving'}, {id: 'fitness', label: 'Fitness'}, {id: 'drinking', label: 'Drinking'}, {id: 'driving', label: 'Driving'}, {id: 'fitness', label: 'Fitness'}]
    return(
        <article className="event-page">
            <section className="event-page-top">
                <div className="photos">
                    {images.length === 1 ? <EventOneImage image={images[0]}/> :
                    images.length === 2 ? <EventTwoImages images={images}/> :
                    images.length === 3 ? <EventThreeImages images={images}/> : ''}
                    
                </div>
                <div className="middle">
                    <div className="image">
                        <div className="main-image">
                            <img src={mainImage} alt="" />
                        </div>
                        <div className="bottom-going">
                        <h2>GOING:</h2>
                        <div className="going-images">
                            <img className="going-image" src="https://friendyfy.blob.core.windows.net/pictures/ba8b368f-e711-44dd-b611-41cdbf36fb3c.jpeg" alt="" />
                            <img className="going-image" src="https://friendyfy.blob.core.windows.net/pictures/ba8b368f-e711-44dd-b611-41cdbf36fb3c.jpeg" alt="" />
                            <img className="going-image" src="https://friendyfy.blob.core.windows.net/pictures/ba8b368f-e711-44dd-b611-41cdbf36fb3c.jpeg" alt="" />
                            <img className="going-image" src="https://friendyfy.blob.core.windows.net/pictures/ba8b368f-e711-44dd-b611-41cdbf36fb3c.jpeg" alt="" />
                            <img className="going-image" src="https://friendyfy.blob.core.windows.net/pictures/ba8b368f-e711-44dd-b611-41cdbf36fb3c.jpeg" alt="" />
                            <img className="going-image" src="https://friendyfy.blob.core.windows.net/pictures/ba8b368f-e711-44dd-b611-41cdbf36fb3c.jpeg" alt="" />
                            <img className="going-image" src="https://friendyfy.blob.core.windows.net/pictures/ba8b368f-e711-44dd-b611-41cdbf36fb3c.jpeg" alt="" />
                            <img className="going-image" src="https://friendyfy.blob.core.windows.net/pictures/ba8b368f-e711-44dd-b611-41cdbf36fb3c.jpeg" alt="" />
                        </div>
                        </div>
                    </div>
                </div>
                <div className="location-time">
                    <MyGoogleMap location={{lat:33, lng:66}} staticMap={true}/>
                    <p className="info-text">Sofia 22.11.2021 20.45</p>
                </div>
            </section>
            <section className="event-page-middle">
                <div className="left-side">
                    <h2 className="event-title">Partying with ivan</h2>
                    <div className="other-info">
                    <p className="event-privacy">Private</p>
                    <p className="reocurring">Weekly</p>
                    </div>
                </div>
                <div className="middle">
                    <div className="interests">
                        {interests.map(interest => <span className="user-interest" key={interest.id} data-id={interest.id}>{interest.label}</span>)}
                    </div>
                </div>
                <div className="right-side">
                    <p className="organized-text">organized by:</p>
                    <h3 className="organizer-name">Andon Gorchov</h3>
                    <div className="buttons">
                        <button className="invite">Invite</button>
                        <button className="share">Share</button>
                    </div>
                </div>
            </section>
        </article>
    )
}

export default Event;
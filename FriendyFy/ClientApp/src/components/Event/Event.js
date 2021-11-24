import React from "react";
import './Event.css'
import MyGoogleMap from "../GoogleMap/MyGoogleMap";
import EventOneImage from "./EventImages/EventOneImage";

const Event = () => {
    const images = ['https://cdn.pixabay.com/photo/2017/07/21/23/57/concert-2527495__480.jpg']
    const mainImage = 'https://media.istockphoto.com/photos/nicelooking-attractive-gorgeous-glamorous-elegant-stylish-cheerful-picture-id1165055006?k=20&m=1165055006&s=612x612&w=0&h=OD4-_BceL_R2eaaBzDQrXNIyydwYXOJX-m-0z12z17s=';
    return(
        <article className="event-page">
            <section className="event-page-top">
                <div className="photos">
                    <EventOneImage image={images[0]}/>
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
                    Location: Sofia
                    Date: 22.11.2021
                    Time: 20.45
                </div>
            </section>
            <h1>test</h1>
        </article>
    )
}

export default Event;
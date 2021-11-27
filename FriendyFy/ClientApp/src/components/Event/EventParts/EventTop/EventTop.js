import React from "react";
import './EventTop.css'
import MyGoogleMap from "../../../GoogleMap/MyGoogleMap";
import EventOneImage from "../../EventImages/EventOneImage/EventOneImage";
import EventTwoImages from "../../EventImages/EventTwoImages/EventTwoImages";
import EventThreeImages from "../../EventImages/EventThreeImages/EventThreeImages";
const EventTop = ({images=[], mainImage, lat, lng, city, time, userImages=[]}) => {

return(<section className="event-page-top">
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
                            {userImages.map(img => <img className="going-image" src="https://friendyfy.blob.core.windows.net/pictures/ba8b368f-e711-44dd-b611-41cdbf36fb3c.jpeg" alt="" />)}
                        </div>
                        </div>
                    </div>
                </div>
                <div className="location-time">
                    <MyGoogleMap location={{lat:lat, lng:lng}} staticMap={true}/>
                    <p className="info-text">{city} {time}</p>
                </div>
            </section>)
}

export default EventTop;
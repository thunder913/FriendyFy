import React from 'react'
import MyGoogleMap from '../../GoogleMap/MyGoogleMap'
import '../PopUp.css';
import './MapPopUp.css'
import PopUp from '../PopUp';

const MapPopUp = ({ title, location, show, setShow, lat, long }) => {
    return (
        <PopUp show={show} setShow={setShow} escClose={true}>
            <div className="popup-outer map-popup">
                <div className="popup-inner inner-map-popup">
                    <header className="title">
                        <p>{title}</p>
                        <p className="town">{location}</p>
                        <button className="close-popup" onClick={() => setShow(false)}>x</button>
                    </header>
                    <MyGoogleMap location={{ lat: lat, lng: long }} staticMap={true} />
                </div>
            </div>
        </PopUp>
    )
}

export default MapPopUp;
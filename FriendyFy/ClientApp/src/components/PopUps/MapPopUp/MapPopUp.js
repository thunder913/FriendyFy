import React from 'react'
import MyGoogleMap from '../../GoogleMap/MyGoogleMap'
import '../PopUp.css';
import './MapPopUp.css'
import PopUp from '../PopUp';
import OutsideClickHandler from "react-outside-click-handler";

const MapPopUp = ({ title, location, show, setShow, lat, long }) => {
    return (
        <PopUp show={show} setShow={setShow} escClose={true}>
            <div className="popup-outer map-popup">
                <OutsideClickHandler
                    onOutsideClick={() => {
                        setShow(false);
                    }}>
                    <div className="popup-inner inner-map-popup">
                        <header className="title">
                            <p>{title}</p>
                            <p className="town">{location}</p>
                            <button className="close-popup" onClick={() => setShow(false)}>x</button>
                        </header>
                        <MyGoogleMap location={{ lat: lat, lng: long }} staticMap={true} zoom={8}/>
                    </div>
                </OutsideClickHandler>
            </div>
        </PopUp>
    )
}

export default MapPopUp;
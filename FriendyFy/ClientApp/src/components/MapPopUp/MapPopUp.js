import React, { useEffect } from 'react'
import MyGoogleMap from '../GoogleMap/MyGoogleMap'
import './MapPopUp.css'
import useScrollBlock from '../../hooks/useScrollBlock'
const MapPopUp = ({title, location, closePopUp, lat, long}) => {
    const [blockScroll, allowScroll] = useScrollBlock();
    const escPressed = (e) => {
        if(e.keyCode === 27){
            closePopUpEvent();
        }
    }
    const closePopUpEvent = () => {
        allowScroll();
        closePopUp();
    }

    useEffect(() => {
        blockScroll();
    }, [])

    useEffect(() => {
        window.addEventListener("keydown", escPressed, false);
        return () => {
            window.removeEventListener("keydown", escPressed, false);
          };
    }, [])
    return(
        <div className="map-popup">
            <div className="inner-map-popup">
                <header className="title">
                    <p>{title}</p>
                    <p className="town">{location}</p>
                    <button className="close-popup" onClick={closePopUpEvent}>x</button>
                </header>
                <MyGoogleMap location={{lat: lat, lng: long}} staticMap={true}/>
            </div>
        </div>
    )
}

export default MapPopUp;
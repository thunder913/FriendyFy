import React, { useEffect } from 'react'
import MyGoogleMap from '../../GoogleMap/MyGoogleMap'
import useScrollBlock from '../../../hooks/useScrollBlock'
import '../PopUp.css';
import './MapPopUp.css'

const MapPopUp = ({title, location, closePopUp, lat, long, blockPageScroll}) => {
    const [blockScroll, allowScroll] = useScrollBlock();
    const escPressed = (e) => {
        if(e.keyCode === 27){
            closePopUpEvent();
        }
    }
    const closePopUpEvent = () => {
        if(blockPageScroll){
        allowScroll();
        }
        closePopUp();
    }

    useEffect(() => {
        if(blockPageScroll){
            blockScroll();
        }
    }, [])

    useEffect(() => {
        window.addEventListener("keydown", escPressed, false);
        return () => {
            window.removeEventListener("keydown", escPressed, false);
          };
    }, [])
    return(
        <div className="popup-outer map-popup">
            <div className="popup-inner inner-map-popup">
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
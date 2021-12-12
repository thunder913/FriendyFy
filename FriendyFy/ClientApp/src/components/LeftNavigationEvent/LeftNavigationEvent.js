import React, { useState, useEffect } from 'react';
import './LeftNavigationEvent.css';
import MapPopUp from '../PopUps/MapPopUp/MapPopUp';
import moment from 'moment';
import { Link } from 'react-router-dom';
const LeftNavigationEvent = ({data, setBlockNavScroll}) =>{
    const [showMap, setShowMap] = useState(false);
    const [parsedTime, setParsedTime] = useState('');

    const showLocationPopUp = () => {
        setShowMap(true);
        setBlockNavScroll(true);
    }

    useState(() => {
        let localization = window.navigator.userLanguage || window.navigator.language;
        moment.locale(localization);
        let utcTime = moment.utc(data.time);
        setParsedTime(utcTime.local().format('LLL'))
    }, [data.time])

    useEffect(() => {
        if(!showMap){
            setBlockNavScroll(false);
        }
    }, [showMap])

    return(
        <div className="event">
        <MapPopUp 
            title="Event Location" 
            location={data.location}
            lat={data.latitude}
            long={data.longitude}
            blockPageScroll={false}
            show={showMap}
            setShow={setShowMap}/>
            <div className="line-parent">
                <div className="line"></div>
            </div>
            <header className="event-header">
                <h4>{data.name}</h4>
                <div className="event-information">
                   <span className="location"> {data.location ? <button onClick={showLocationPopUp}>{data.location}</button> : ''}</span>
                    <span>{parsedTime}</span>
                </div>
            </header>
            <main className="event-card">
            <div className="left-side">
                <section className="interests">
                    {data.interests.map(interest => (<Link to={`/search-page?interests=[{"label":"${interest.label}","value":${interest.id}}]`} key={interest.id} className="interest">{interest.label}</Link>))}
                </section>
            </div>
            <div className="right-side">
            <div className={"attendingUsers "+getImageWidthClassName(data.goingPhotos.length)}>
                {data.goingPhotos ? data.goingPhotos.map(user => (
                    <div key={user} className="attending-user">
                        <div className="attending-user-photo">
                            <img src={user} alt="" />
                        </div>
                    </div>
                )): ''}
            </div>
            <Link to={'/event/' + data.id} className="view-button">View</Link>
            </div>
            </main>
        </div>)
}

function getImageWidthClassName(count){
    if (count===1) {
        return "w-1";
    }else if (count===2) {
        return "w-2";
    }
    else if (count <= 4) {
        return "w-3";
    }
    else if (count <= 8) {
        return "w-4";
    }
}

export default LeftNavigationEvent;
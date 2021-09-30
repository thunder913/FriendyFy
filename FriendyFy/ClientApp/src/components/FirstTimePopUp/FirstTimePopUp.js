import React, { useState } from 'react';
import MyGoogleMap from '../GoogleMap/MyGoogleMap';

import './FirstTimePopUp..css';


const RegisterPopUp = (props) => {
    const [location, setLocation] = useState([]);


    return(
    <div className="first-time-popup">
        <div className="popup-text">
            <h2 className="first-time-title">This is your first time logging in.</h2>
            <h3 className="first-time-undertitle">You have to fill some information about yourself in order to help us recommend the events, you really wish to attend!</h3>
            <form>
                <input type="file" name="" id="profile-picture" />
                <select name="" id="interest">
                    <option value="">Drink</option>
                    <option value="">And</option>
                    <option value="">Drive</option>
                </select>
                <div className="find-location">
                    <MyGoogleMap location={location} setLocation={setLocation}></MyGoogleMap>
                </div>
            </form>
        </div>
    </div>)
}

export default RegisterPopUp


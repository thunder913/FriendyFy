import React, { useState } from 'react';
import MyGoogleMap from '../GoogleMap/MyGoogleMap';
import InterestsDropdown from '../InterestsDropdown/InterestsDropdown';
import './FirstTimePopUp..css';
import ImgDropAndCrop from '../ImgDropAndCrop/ImgDropAndCrop.js';
import Dropzone from 'react-dropzone';

const FirstTimePopUp = (props) => {
    const [location, setLocation] = useState([]);
    
    return (
        <div className="first-time-popup">
            <div className="popup-text">
                <h2 className="first-time-title">This is your first time logging in.</h2>
                <h3 className="first-time-undertitle">You have to fill some information about yourself in order to help us recommend the events, you really wish to attend!</h3>
                <form>
                    <input type="file" name="" id="profile-picture" className="upload-picture" />
                    <div className="find-location">
                        <MyGoogleMap location={location} setLocation={setLocation}></MyGoogleMap>
                    </div>
                </form>
                <InterestsDropdown></InterestsDropdown>

                <ImgDropAndCrop/>

                <textarea name="" id="quote" rows="2" className="css-p8sdl4-control" placeholder="Enter a quote/description that will show in your profile"></textarea>
            </div>
        </div>)
}

export default FirstTimePopUp


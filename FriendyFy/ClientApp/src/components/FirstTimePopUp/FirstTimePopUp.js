import React, { useState } from 'react';
import MyGoogleMap from '../GoogleMap/MyGoogleMap';
import InterestsDropdown from '../InterestsDropdown/InterestsDropdown';
import './FirstTimePopUp..css';
import ImgDropAndCrop from '../ImgDropAndCrop/ImgDropAndCrop.js';

const FirstTimePopUp = (props) => {
    const [location, setLocation] = useState([]);
    const [profileImg, setProfileImg] = useState(null)
    const [coverImg, setCoverImg] = useState(null)
    
    const doSomething = () => {
        console.log(profileImg);
    }

    return (
        <div className="first-time-popup">
            <div className="popup-text">
                <h2 className="first-time-title">This is your first time logging in.</h2>
                <h3 className="first-time-undertitle">You have to fill some information about yourself in order to help us recommend the events, you really wish to attend!</h3>
                <form>
                <ImgDropAndCrop 
                    placeholder="Choose a profile photo." 
                    aspectRatio={1/1}
                    imgSrc={profileImg}
                    setImgSrc={setProfileImg}
                    imageClass="user-profile-photo"/>

                    <div className="find-location">
                        <MyGoogleMap location={location} setLocation={setLocation}></MyGoogleMap>
                    </div>
                </form>
                <InterestsDropdown></InterestsDropdown>

                <ImgDropAndCrop 
                    placeholder="Choose a cover photo." 
                    aspectRatio={16/9}
                    imgSrc={coverImg}
                    setImgSrc={setCoverImg}
                    imageClass="cover-user-image"/>

                <textarea name="" id="quote" rows="2" className="css-p8sdl4-control" placeholder="Enter a quote/description that will show in your profile"></textarea>
                <input type="submit" value="Click me" onClick={doSomething}/>
            </div>
        </div>)
}

export default FirstTimePopUp


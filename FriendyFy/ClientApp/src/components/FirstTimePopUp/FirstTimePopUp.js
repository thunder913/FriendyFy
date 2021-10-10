import React, { useState } from 'react';
import MyGoogleMap from '../GoogleMap/MyGoogleMap';
import InterestsDropdown from '../InterestsDropdown/InterestsDropdown';
import './FirstTimePopUp..css';
import ImgDropAndCrop from '../ImgDropAndCrop/ImgDropAndCrop.js';
import axios from 'axios';
import { finishFirstTimeSetup } from '../../services/userService';

const FirstTimePopUp = (props) => {
    const [location, setLocation] = useState('');
    const [profileImg, setProfileImg] = useState(null)
    const [coverImg, setCoverImg] = useState(null)
    const [interests, setInterests] = useState([]);
    const [quote, setQuote] = useState('');
    const [errorMessage, setErrorMessage] = useState(null);

    const submitForm = async () => {
        console.log(location);
        console.log(profileImg);
        console.log(coverImg);
        console.log(interests);
        console.log(quote);

        if(location === ''){
            setErrorMessage("You haven't chosen a location.")
        }else if(profileImg === null){
            setErrorMessage("You must choose a profile image.")
        }else if(coverImg === null){
            setErrorMessage("You  must choose a cover image for your profile.");
        }else if(interests.length < 3){
            setErrorMessage("You must choose at least 3 interests.")
        }else if(quote.length<1){
            setErrorMessage("You must add a description/quote to display in your profile.")
        }else{
            setErrorMessage(null);
        }

        if(errorMessage){
            return;
        }
        let profilePhoto = new FormData();
        profilePhoto.append("formfile", profilePhoto);

        let coverPhoto = new FormData();
        coverPhoto.append("formfile", coverPhoto);

        console.log(interests);
        let formInterests = interests.map(x => ({label: x.label, id: Number.isInteger(x.value) ? x.value : 0, isNew: x.__isNew__}));
        let data = {
            profilePhoto: profilePhoto,
            coverPhoto: coverPhoto,
            quote: quote,
            latitude: location.lat,
            longitude: location.lng,
            interests: formInterests
        };

        console.log(data);

        const res = await finishFirstTimeSetup(data);
        console.log(res);
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
                <InterestsDropdown setInterests={setInterests}></InterestsDropdown>

                <ImgDropAndCrop 
                    placeholder="Choose a cover photo." 
                    aspectRatio={16/9}
                    imgSrc={coverImg}
                    setImgSrc={setCoverImg}
                    imageClass="cover-user-image"/>

                <textarea onChange={(e) => setQuote(e.target.value)} name="" id="quote" rows="2" className="css-p8sdl4-control" placeholder="Enter a quote/description that will show in your profile"></textarea>
                {errorMessage ? <span className="error-message">{errorMessage}</span> : ''}
                <input type="submit" className="create-account-button" value="Finish My Account" onClick={submitForm}/>
            </div>
        </div>)
}

export default FirstTimePopUp


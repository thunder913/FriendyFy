import React, { useState } from 'react';
import MyGoogleMap from '../GoogleMap/MyGoogleMap';
import InterestsDropdown from '../InterestsDropdown/InterestsDropdown';
import './FirstTimePopUp..css';
import ImgDropAndCrop from '../ImgDropAndCrop/ImgDropAndCrop.js';
import axios from 'axios';

const FirstTimePopUp = ({checkFirstTimePopUp}) => {
    const [location, setLocation] = useState('');
    const [profileImg, setProfileImg] = useState(null)
    const [coverImg, setCoverImg] = useState(null)
    const [interests, setInterests] = useState([]);
    const [quote, setQuote] = useState('');
    const [errorMessage, setErrorMessage] = useState(null);

    const submitForm = async () => {
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
        let formInterests = interests.map(x => ({label: x.label, id: Number.isInteger(x.value) ? x.value : 0, isNew: x.__isNew__ ?? false}));
        
        let formdata = new FormData();
        formdata.append("profilePhoto", profileImg);
        formdata.append("coverPhoto", coverImg);
        formdata.append("quote", quote);
        formdata.append("interests", JSON.stringify(formInterests));
        formdata.append("latitude", location.lat);
        formdata.append("longitude", location.lng);

        console.log(profileImg);
        console.log(coverImg);
        let response = await axios.post("/api/FinishFirstTimeSetup", formdata);
        if(response.status === 200){
            await checkFirstTimePopUp();
        }else{
            setErrorMessage(response.data);
        }
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
                    setCroppedImg={setProfileImg}
                    imageClass="user-profile-photo"/>

                    <div className="find-location">
                        <MyGoogleMap location={location} setLocation={setLocation}></MyGoogleMap>
                    </div>
                </form>
                <InterestsDropdown placeholder='Choose at least 3 interests' setInterests={setInterests}></InterestsDropdown>

                <ImgDropAndCrop 
                    placeholder="Choose a cover photo." 
                    aspectRatio={837/310}
                    setCroppedImg={setCoverImg}
                    imageClass="cover-user-image"/>

                <textarea onChange={(e) => setQuote(e.target.value)} name="" id="quote" rows="2" className="css-p8sdl4-control" placeholder="Enter a quote/description that will show in your profile"></textarea>
                {errorMessage ? <span className="error-message">{errorMessage}</span> : ''}
                <input type="submit" className="create-account-button" value="Finish My Account" onClick={submitForm}/>
            </div>
        </div>)
}

export default FirstTimePopUp


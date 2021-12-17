import './Settings.css'
import React, { useEffect, useState } from 'react';
import PageLoading from '../PageLoading/PageLoading';
import moment from 'moment';
import "moment/min/locales";
import Datetime from 'react-datetime';
import ImgDropAndCrop from '../ImgDropAndCrop/ImgDropAndCrop';
import MyGoogleMap from '../GoogleMap/MyGoogleMap';
import InterestsDropdown from "../InterestsDropdown/InterestsDropdown";
import { TextareaAutosize } from '@mui/material';
import { getUserData } from '../../services/userService';
import axios from 'axios';
import { useLoggedIn } from '../../contexts/LoggedInContext';
import { NotificationManager } from 'react-notifications';

const Settings = () => {
    const { resetUser, loggedIn } = useLoggedIn();
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [, setUser] = useState({});
    const [momentDate, setMomentDate] = useState('');
    const [profileImage, setProfileImage] = useState('');
    const [coverImage, setCoverImage] = useState('');
    const [location, setLocation] = useState('');
    const [interests, setInterests] = useState([]);
    const [description, setDescription] = useState('')
    const [showAddProfileImage, setShowAddProfileImage] = useState(false);
    const [showAddCoverImage, setShowAddCoverImage] = useState(false);
    const [newProfileImage, setNewProfileImage] = useState('');
    const [newCoverImage, setNewCoverImage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [displayError, setDisplayError] = useState(true);

    function getCurrentLocalization() {
        let localization = window.navigator.userLanguage || window.navigator.language;
        moment.locale(localization);
        return moment.locale();
    }

    const onDateChangeHandler = (e) => {
        setMomentDate(e);
    }

    const submitForm = async () => {
        if (firstName.length < 1) {
            setErrorMessage('The first name cannot be empty!');
            return;
        } else if (lastName.length < 1) {
            setErrorMessage('The last name cannot be empety!');
            return;
        } else if (location === '') {
            setErrorMessage("You haven't chosen a location.")
            return;
        } else if (showAddProfileImage && !newProfileImage) {
            setErrorMessage("You must choose a profile image.")
            return;
        } else if (showAddCoverImage && !newCoverImage) {
            setErrorMessage("You  must choose a cover image for your profile.");
            return;
        } else if (interests.length < 3) {
            setErrorMessage("You must choose at least 3 interests.")
            return;
        } else if (description.length < 1) {
            setErrorMessage("You must add a description/quote to display in your profile.")
            return;
        } else {
            setErrorMessage(null);
        }

        if (errorMessage) {
            setDisplayError(true);
            return;
        }
        let formInterests = interests.map(x => ({ label: x.label, id: Number.isInteger(x.value) ? x.value : 0, isNew: x.__isNew__ ?? false }));

        let formdata = new FormData();

        formdata.append("profileImage", showAddProfileImage ? newProfileImage : profileImage);
        formdata.append("coverImage", showAddCoverImage ? newCoverImage : coverImage);
        formdata.append("description", description);
        formdata.append("interests", JSON.stringify(formInterests));
        formdata.append("latitude", location.lat);
        formdata.append("longitude", location.lng);
        formdata.append("userId", loggedIn.id);
        formdata.append("firstName", firstName);
        formdata.append("lastName", lastName);
        formdata.append("date", moment(momentDate).format("DD/MM/YYYY"));
        formdata.append("changedProfileImage", showAddProfileImage);
        formdata.append("changedCoverImage", showAddCoverImage);

        // console.log(newProfileImage, 'newProfileImage');
        // console.log(profileImage, 'profileImage');
        // console.log(newCoverImage, 'newCoverImage');
        // console.log(coverImage, 'coverImage');
        // console.log(description, 'description');
        // console.log(location, 'location');
        // console.log(newProfileImage, 'newProfileImage');
        // console.log(firstName)
        // console.log(lastName)
        // console.log(interests, 'interests')
        // console.log(errorMessage);
        await axios.post("/api/editUserData", formdata).then(() => {
            resetUser();
            NotificationManager.success('Successfully updated your details!', '', 4000)
        }).catch(error => {
            if (error.response) {
                NotificationManager.error(error.response.data, '', 5000);
            }
        });
    }

    useEffect(() => {
        if (errorMessage && displayError) {
            setDisplayError(false);
            NotificationManager.error(errorMessage, '', 5000);
        }
    }, [errorMessage, displayError])

    useEffect(() => {
        getUserData()
            .then(res => res.json())
            .then(data => {
                setUser(data)
                //that wont work
                setProfileImage(data.profilePhoto)
                setCoverImage(data.coverPhoto)
                setDescription(data.quote)
                let selectedInterests = data.interests.map(x => ({ label: x.label, value: x.id }));
                setInterests(selectedInterests)
                setLocation({ lat: data.latitude, lng: data.longitude })
                setMomentDate(moment(data.birthday)._d);
                setFirstName(data.firstName);
                setLastName(data.lastName);
            });
    }, [])

    return (<PageLoading>
        <div className="settings-page">
            <h1 className="settings-title">Change your profile data</h1>
            <div className="name-inputs">
                <input type="text" placeholder='First Name' defaultValue={firstName} onChange={e => setFirstName(e.target.value)} />
                <input type="text" placeholder='Last Name' defaultValue={lastName} onChange={e => setLastName(e.target.value)} />
                <Datetime
                    input={true}
                    initialViewMode='years'
                    locale={getCurrentLocalization()}
                    timeFormat={false}
                    dateFormat={moment.localeData().longDateFormat('LL')}
                    onChange={onDateChangeHandler}
                    className='birthday'
                    inputProps={{ id: 'birthday', placeholder: 'Birthday', autoComplete: "off" }}
                    value={momentDate}
                />
            </div>
            <div className="change-pictures">
                <div className="change-picture">
                    {showAddProfileImage ? <ImgDropAndCrop
                        placeholder="Choose a new profile image."
                        aspectRatio={1 / 1}
                        setCroppedImg={setNewProfileImage}
                        imageClass="user-profile-photo" /> : <img src={profileImage} alt="" />}
                    <button onClick={() => setShowAddProfileImage(prev => !prev)}>
                        {showAddProfileImage ? 'Revert' : 'Change Profile Picture'}
                    </button>
                </div>
                <div className="change-picture cover-picture-change">
                    <div>
                        {showAddCoverImage ? <ImgDropAndCrop
                            placeholder="Choose a new cover image."
                            setCroppedImg={setNewCoverImage}
                            aspectRatio={837 / 310}
                            imageClass="user-profile-photo" /> : <img src={coverImage} alt="" />}
                        <button className='showCoverButton' onClick={() => setShowAddCoverImage(prev => !prev)}>
                            {showAddCoverImage ? 'Revert' : 'Change Cover Picture'}
                        </button>
                    </div>
                    <TextareaAutosize
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="What is the event about?"
                        id="post-description" minRows={2}
                        value={description} />
                    <InterestsDropdown
                        defaultData={interests}
                        placeholder='Choose at least 3 interests'
                        setInterests={setInterests} />
                </div>
            </div>
            <MyGoogleMap location={location} setLocation={setLocation} zoom={8} />

            <button className="change-user-data" onClick={() => submitForm()}>Save Changes</button>
        </div>
    </PageLoading>)
}

export default Settings;
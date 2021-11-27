import React, { useState, useEffect } from "react";
import './CreateEventPopUp.css';
import Select from 'react-select';
import { useLoggedIn } from "../../contexts/LoggedInContext";
import MyGoogleMap from "../GoogleMap/MyGoogleMap";
import { TextareaAutosize } from '@mui/material';
import Datetime from 'react-datetime';
import InterestsDropdown from "../InterestsDropdown/InterestsDropdown";
import moment from 'moment';
import { createEvent } from '../../services/eventService'
import "react-datetime/css/react-datetime.css";
import ImgDropAndCrop from "../ImgDropAndCrop/ImgDropAndCrop";

const CreateEventPopUp = ({ closePopUp }) => {
    const [privacySettings, setPrivacySettings] = useState('Private');
    const [reocurringTime, setReocurringTime] = useState('daily');
    const [description, setDescription] = useState('');
    const [location, setLocation] = useState('');
    const [interests, setInterests] = useState([]);
    const [name, setName] = useState('');
    const [momentDate, setMomentDate] = useState('');
    const [utcDate, setUtcDate] = useState('');
    const [isReocurring, setIsReocurring] = useState(false);
    const { loggedIn } = useLoggedIn();
    const [eventError, setEventError] = useState('');
    const [image, setImage] = useState('');

    function getCurrentLocalization() {
        let localization = window.navigator.userLanguage || window.navigator.language;
        moment.locale(localization);
        return moment.locale();
    }

    const onDateChangeHandler = (e) => {
        setUtcDate(moment(e._d).utc().format("DD/MM/YYYY HH:mm"));
        setMomentDate(e._d);
    }

    const onCreateButtonClicked = (e) => {
        e.preventDefault();
        console.log(image);
        if(name.length < 2){
            setEventError('The name cannot be that short!')
        }else if(moment() > momentDate){
            setEventError('The date may not be selected or is in the past!')
        }else if(interests.length == 0){
            setEventError('Choose some interests, in order to make the event more attractable!')
        }else if(interests.length>6){
            setEventError('You have chosen more than 6 interests!');
        }
        else if(!location){
            setEventError('Choose a location!')
        }else if(!description){
            setEventError('Add a short description to the event!')
        }else if(privacySettings!='Private' && privacySettings!='Public'){
            setEventError('The privacy of the event must be either Private or Public!')
        }else if(!image){
            setEventError('You must upload an image for the event!');
        }
        if(!eventError){
            let intereststString = JSON.stringify(interests.map(x => ({label: x.label, id: Number.isInteger(x.value) ? x.value : 0, isNew: x.__isNew__ ?? false})));
            createEvent(name, utcDate, intereststString, privacySettings, location.lat, location.lng, description, image, isReocurring, (isReocurring ? reocurringTime : null));
        }
    }

    return (
        <div className="create-event-popup">
            <div className="event-popup">
                <header className="create-event-header">
                    <p className="create-event-title">Create An Event</p>
                    <button onClick={closePopUp} className="close-create-event">x</button>
                </header>
                <section className="create-event-underheader">
                    <div className="image">
                        <img src={loggedIn.profilePhoto} alt="" />
                    </div>
                    <span>{loggedIn.firstName} {loggedIn.lastName}</span>
                    <Select
                        theme={(theme) => ({
                            ...theme,
                            colors: {
                                ...theme.colors,
                                primary25: '#595757',
                                primary: 'rgb(212, 212, 212)',
                                neutral0: '#3F3B3B',
                                neutral80: 'white',
                                neutral60: '#aaaaaa',
                                neutral10: '#595757',
                                dangerLight: '#523737',
                            }
                        })}
                        className="privacy-picker"
                        isSearchable={false}
                        options={[{ value: 'Private', label: 'Private' }, { value: 'Public', label: 'Public' }]}
                        defaultValue={{ value: privacySettings, label: 'Private' }}
                        onChange={(e) => setPrivacySettings(e.value)}
                    />
                </section>
                <div className="top-inputs">
                <input className="event-name" type="text" placeholder="Name" onChange={e => setName(e.target.value)}/>
                <Datetime 
                    dateFormat="YYYY-MM-DD" 
                    timeFormat="HH:mm"
                    input={true}
                    initialViewMode='years'
                    dateFormat={moment.localeData().longDateFormat('LL')}
                    locale={getCurrentLocalization()}
                    onChange={onDateChangeHandler}
                    placeholder="When is it going to happen?"
                    inputProps={{id: 'datetime', placeholder: 'When is it going to happen?', autoComplete: "off" }}
                     />
                </div>
                <InterestsDropdown setInterests={setInterests} placeholder='Choose up to 6 interests to attract more people easily'></InterestsDropdown>
                <MyGoogleMap location={location} setLocation={setLocation}></MyGoogleMap>
                <div className="create-event-image">
                    <ImgDropAndCrop 
                        placeholder="Import an image for the event." 
                        setCroppedImg={setImage}
                        imageClass="user-profile-photo"/>
                </div>
                <div className="reocurring-checkbox">
                    <input type="checkbox" id="reocurring" onChange={() => setIsReocurring(prev => !prev)} />
                    <label htmlFor="reocurring">Reocurring event</label>         
                    {isReocurring ? <Select
                            theme={(theme) => ({
                                ...theme,
                                colors: {
                                    ...theme.colors,
                                    primary25: '#595757',
                                    primary: 'rgb(212, 212, 212)',
                                    neutral0: '#3F3B3B',
                                    neutral80: 'white',
                                    neutral60: '#aaaaaa',
                                    neutral10: '#595757',
                                    dangerLight: '#523737',
                                }
                            })}
                            className="privacy-picker"
                            isSearchable={false}
                            options={[{ value: 'daily', label: 'Daily' }, { value: 'weekly', label: 'Weekly' }, { value:'monthly', label:'Monthly'}]}
                            defaultValue={{ value: reocurringTime, label: 'Daily' }}
                            onChange={(e) => setReocurringTime(e.value)}
                        /> : ''}
                </div>
                <TextareaAutosize 
                onChange={(e) => setDescription(e.target.value)} 
                placeholder="What is the event about?" 
                id="post-description" minRows={2}/>
                <p className="event-error-message">{eventError}</p>

                <button className="create-event" onClick={onCreateButtonClicked}>Create Event</button>
            </div>
        </div>
    )
}

export default CreateEventPopUp;
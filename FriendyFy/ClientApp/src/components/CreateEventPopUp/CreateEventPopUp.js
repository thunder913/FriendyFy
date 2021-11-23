import React, { useState, useEffect } from "react";
import './CreateEventPopUp.css';
import Select from 'react-select';
import { useLoggedIn } from "../../contexts/LoggedInContext";
import MyGoogleMap from "../GoogleMap/MyGoogleMap";
import { TextareaAutosize } from '@mui/material';
import Datetime from 'react-datetime';
import InterestsDropdown from "../InterestsDropdown/InterestsDropdown";
import moment from 'moment';
import "react-datetime/css/react-datetime.css";

const CreateEventPopUp = ({ closePopUp }) => {
    const [privacySettings, setPrivacySettings] = useState('private');
    const [description, setDescription] = useState('');
    const [location, setLocation] = useState('');
    const [interests, setInterests] = useState([]);
    const { loggedIn } = useLoggedIn();

    function getCurrentLocalization() {
        let localization = window.navigator.userLanguage || window.navigator.language;
        moment.locale(localization);
        return moment.locale();
    }

    const onCreateButtonClicked = (e) => {
        e.preventDefault();

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
                        options={[{ value: 'private', label: 'Private' }, { value: 'public', label: 'Public' }]}
                        defaultValue={{ value: privacySettings, label: 'Private' }}
                    />
                </section>
                <div className="top-inputs">
                <input className="event-name" type="text" placeholder="Name"/>
                <Datetime 
                    dateFormat="YYYY-MM-DD" 
                    timeFormat="HH:mm"
                    initialValue={{minutes: 0, hours: 12}}
                    input={true}
                    initialViewMode='years'
                    dateFormat={moment.localeData().longDateFormat('LL')}
                    locale={getCurrentLocalization()}
                    placeholder="When is it going to happen?"
                    inputProps={{id: 'datetime', placeholder: 'When is it going to happen?', autoComplete: "off" }}
                     />
                </div>
                <InterestsDropdown setInterests={setInterests}></InterestsDropdown>
                <MyGoogleMap location={location} setLocation={setLocation}></MyGoogleMap>

                <TextareaAutosize 
                onChange={(e) => setDescription(e.target.value)} 
                placeholder="What is the event about?" 
                id="post-description" minRows={2}/>
                <div className="reocurring-checkbox">
                <input type="checkbox" id="reocurring" />
                <label htmlFor="reocurring">Reocurring event</label>                    
                </div>
                <button className="create-event" onClick={onCreateButtonClicked}>Create Event</button>
            </div>
        </div>
    )
}

export default CreateEventPopUp;
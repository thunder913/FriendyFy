import React from "react";
import PageLoading from "../PageLoading/PageLoading";
import './SearchPage.css'
import Datetime from 'react-datetime';
import InterestsDropdown from "../InterestsDropdown/InterestsDropdown";
import { useState } from "react/cjs/react.development";
import moment from "moment";
import { FormGroup, RadioGroup, FormControlLabel, Radio, FormControl, Checkbox } from "@mui/material";

const SearchPage = () => {
    const [interests, setInterests] = useState([]);
    const [momentDate, setMomentDate] = useState('');

    function getCurrentLocalization() {
        let localization = window.navigator.userLanguage || window.navigator.language;
        moment.locale(localization);
        return moment.locale();
    }

    const onDateChangeHandler = (e) => {
        setMomentDate(e._d);
    }


    return (<PageLoading>
        <div className="search-page">
            <div className="search-options">
                <h2 className="search-title">Search</h2>
                <input type="text" placeholder="Search" />
                <div className="event-type-radio">
                    <FormControl component="fieldset">
                        <RadioGroup row aria-label="Peope" name="row-radio-buttons-group">
                            <FormControlLabel value="Person" control={<Radio />} label="Person" />
                            <FormControlLabel value="Event" control={<Radio />} label="Event" />
                        </RadioGroup>
                    </FormControl>
                </div>
                <InterestsDropdown placeholder='Search by interests' setInterests={setInterests}></InterestsDropdown>
                <FormControlLabel control={<Checkbox />} label="Only Your Events" />
                <Datetime
                    input={true}
                    initialViewMode='years'
                    locale={getCurrentLocalization()}
                    timeFormat={false}
                    dateFormat={moment.localeData().longDateFormat('LL')}
                    onChange={onDateChangeHandler}
                    className='birthday'
                    inputProps={{ id: 'birthday', placeholder: 'Event date', autoComplete: "off" }}
                />
                <button className="search">Search</button>
            </div>
            <div className="results">
                <div className="search-result">
                    <div className="image">
                        <img src="https://friendyfy.blob.core.windows.net/pictures/580d125c-3190-4f41-b820-0c2dedf3b85f.jpeg" alt="" />
                    </div>
                    <p className="name">Name Nameov</p>
                    <p className="mutual-friends">5 Mutual friends</p>
                    <button className="view-button">View</button>
                </div>
                <div className="search-result">
                <div className="image">
                    <img src="https://friendyfy.blob.core.windows.net/pictures/580d125c-3190-4f41-b820-0c2dedf3b85f.jpeg" alt="" />
                </div>
                <p className="name">Name Nameov</p>
                <div className="interests">
                    <span>Swimming</span>
                    <span>Dancing</span>
                    <span>Volleyball</span>
                    <span>Volleyball</span>
                    <span>Volleyball</span>
                    <span>Volleyball</span>
                    <span>Volleyball</span>
                </div>
                <button className="view-button">View</button>
            </div>
            </div>
        </div>
    </PageLoading>)
}

export default SearchPage;
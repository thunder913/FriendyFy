import React, { useState } from 'react';
import Datetime from 'react-datetime';
import moment from 'moment';
import "moment/min/locales";
import './RegisterBirthday.css'
const RegisterBirthday = ({setSelectedDate}) => {
    const [,setBirthDay] = useState('');
    const [birthdayError, setBirthdayError] = useState(false);

    function getCurrentLocalization() {
        let localization = window.navigator.userLanguage || window.navigator.language;
        moment.locale(localization);
        return moment.locale();
    }

    function onBirthdayChangeHandler(e) {
        var date = moment(e._d);
        let today = moment();
        let startDate = moment("01/01/1900", "DD/MM/YYYY");
        if (!date.isBetween(startDate, today)) {
            setBirthdayError(true);
        } else {
            setBirthDay(e._d);
            setSelectedDate(moment(e._d).format("DD/MM/YYYY"));
            setBirthdayError(false);
        }
    }
    return (
        <div className="birthday">
            {birthdayError ? <p className="birthday-error">Invalid birthday date!</p> : ''}
            <Datetime
                input={true}
                initialViewMode='years'
                locale={getCurrentLocalization()}
                timeFormat={false}
                dateFormat={moment.localeData().longDateFormat('LL')}
                onChange={onBirthdayChangeHandler}
                className='birthday'
                inputProps={{id: 'birthday', placeholder: 'Birthday', autoComplete: "off" }}
            />
        </div>
);
}

export default RegisterBirthday;
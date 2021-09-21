import React, { useState } from 'react';
import Datetime from 'react-datetime';
import moment from 'moment';
import "moment/min/locales";
import './RegisterBirthday.css'
const RegisterBirthday = () => {
    const [birthDay, setBirthDay] = useState('');
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
            setBirthdayError(false);
        }
    }
    return (
        <div className="birthday">
            <Datetime
                input={true}
                initialViewMode='years'
                locale={getCurrentLocalization()}
                timeFormat={false}
                dateFormat={moment.localeData().longDateFormat('LL')}
                inputProps={{ placeholder: "Birthday" }}
                onChange={onBirthdayChangeHandler}
                className='birthday'
                inputProps={{id: 'birthday', placeholder: 'Birthday'}}
            />
            {birthdayError ? <span className="birthday-error">Invalid birthday date!</span> : ''}
        </div>
);
}

export default RegisterBirthday;
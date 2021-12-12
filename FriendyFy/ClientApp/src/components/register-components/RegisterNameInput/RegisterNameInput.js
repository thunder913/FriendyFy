import './RegisterNameInput.css'
import React, { useState, useEffect } from 'react';
import InputWithValidation from '../../InputWithValidation/InputWithValidation';

const RegisterNameInput = () => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [firstNameError, setFirstNameError] = useState(null);
    const [lastNameError, setLastNameError] = useState(null);
    const [firstLoad, setFirstLoad] = useState(true);
    const [firstNameErrorBubble, setFirstNameErrorBubble] = useState(false);
    const [lasttNameErrorBubble, setLastNameErrorBubble] = useState(false);

    const letterRegex = /^[A-Za-z\u00C0-\u1FFF\u2800-\uFFFD 0-9-]+$/;

    function onFirstNameChangeHandler(e) {
        setFirstName(e.target.value);
    }

    function onLastNameChangeHandler(e) {
        setLastName(e.target.value);
    }

    useEffect(() => {
        function firstNameValidation() {
            if (firstName.length > 50) {
                setFirstNameError('First name cannot be longer than 50 characters!');
            } else if (firstName.length < 2) {
                setFirstNameError('The first name must be at least 2 characters long!');
            }
            else if (!firstName.match(letterRegex)) {
                setFirstNameError('The first name must contain only letters!');
            }
            else {
                setFirstNameError(null)
            }
        }

        if (!firstLoad) {
            const timeoutId = setTimeout(() => {
                firstNameValidation()
            }
                , 500);
            return () => clearTimeout(timeoutId);
        }
        setFirstLoad(false);
        //eslint-disable-next-line
    }, [firstName]);

    useEffect(() => {
        function lastNameValidation() {
            if (lastName.length > 50) {
                setLastNameError('Last name cannot be longer than 50 characters!');
            } else if (lastName.length < 2) {
                setLastNameError('The last name must be at least 2 characters long!');
            }
            else if (!lastName.match(letterRegex)) {
                setLastNameError('The last name must contain only letters!');
            }
            else {
                setLastNameError(null)
            }
        }

        if (!firstLoad) {
            const timeoutId = setTimeout(() => {
                lastNameValidation()
            }
                , 500);
            return () => clearTimeout(timeoutId);
        }
        //eslint-disable-next-line
    }, [lastName]);

    return (
        <div className="names">
            <InputWithValidation
                id='first-name'
                error={firstNameError}
                placeholder='First Name'
                value={firstName}
                changeHandler={onFirstNameChangeHandler}
                setErrorBubble={setFirstNameErrorBubble}
                errorBubble={firstNameErrorBubble}
            />
            <InputWithValidation
                id='last-name'
                error={lastNameError}
                placeholder='Last Name'
                value={lastName}
                changeHandler={onLastNameChangeHandler}
                setErrorBubble={setLastNameErrorBubble}
                errorBubble={lasttNameErrorBubble}
            />

        </div>)
}

export default RegisterNameInput;
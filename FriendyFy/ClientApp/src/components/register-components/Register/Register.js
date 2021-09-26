import React, { useEffect } from "react";
import { useState } from "react";
import "./Register.css"
import "react-datetime/css/react-datetime.css";
import RegisterNameInput from "../RegisterNameInput/RegisterNameInput.js";
import RegisterEmailField from "../RegisterEmailField/RegisterEmailField";
import RegisterBirthday from "../RegisterBirthday/RegisterBirthday";
import RegisterGender from "../RegisterGender/RegisterGender";
import RegisterPasswords from "../RegisterPasswords/RegisterPasswords";
import moment from 'moment';

const Register = () => {

    const [registerError, setRegisterError] = useState(null);

    function onSubmitHandler(e) {
        e.preventDefault();

        fetch('/api/register', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(
                {
                    firstName: e.target['first-name'].value,
                    lastName: e.target['last-name'].value,
                    birthday: '27/02/2019',
                    gender: e.target['gender'].value,
                    password: e.target['password'].value,
                    confirmPassword: e.target['confirm-password'].value,
                    email: e.target['email-input'].value
                })
        })
        .then(async res => setRegisterError(await res.text()))
    }

    return (
        <form className="register" onSubmit={onSubmitHandler}>
            {registerError ? <span className='register-error'>{registerError}</span>: ''}
            <RegisterNameInput/>
            <RegisterEmailField/>
            <div className="bottom-row">
                <RegisterBirthday/>
               <RegisterGender/>
            </div>
            <RegisterPasswords/>
        <p className="tos">By clicking <strong>Register</strong>, you agree to our Terms. Learn how we collect, use and share your data in our Data Policy and how we use cookies and similar technology in our Cookies Policy. You may receive Emails from us and can opt out any time.</p>
            <input id="register-button" type="submit" value="Register" />
        </form>
    )
}

export default Register;
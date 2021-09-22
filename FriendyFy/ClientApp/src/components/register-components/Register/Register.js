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
    function onSubmitHandler(e) {
        e.preventDefault();
        let date = moment(e.target['birthday'].value, '\'' + moment.localeData().longDateFormat('LL') + '\'');
        console.log(date._d);
        console.log(e.target['first-name'].value);
        console.log(e.target['last-name'].value);
        console.log(e.target['birthday'].value);
        console.log(e.target['gender'].value);
        console.log(e.target['password'].value);
        console.log(e.target['confirm-password'].value);
    }

    return (
        <form className="register" onSubmit={onSubmitHandler}>
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
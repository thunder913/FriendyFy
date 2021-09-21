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
            <input id="register-button" type="submit" value="Register" />
        </form>
    )
}

export default Register;
import React from "react";
import { useState } from "react";
import "./Register.css"
import "react-datetime/css/react-datetime.css";
import RegisterSuccess from "../RegisterSuccess/RegisterSuccess";
import RegisterForm from "../RegisterForm/RegisterForm";

const Register = () => {

    const [registerError, setRegisterError] = useState(null);
    const [selectedDate, setSelectedDate] = useState('');
    const [registerSuccess, setRegisterSuccess] = useState(false);

    function onSubmitHandler(e) {
        e.preventDefault();

        fetch('/api/register', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(
                {
                    firstName: e.target['first-name'].value,
                    lastName: e.target['last-name'].value,
                    birthday: selectedDate,
                    gender: e.target['gender'].value,
                    password: e.target['password'].value,
                    confirmPassword: e.target['confirm-password'].value,
                    email: e.target['email-input'].value
                })
        })
        .then(async res => {
            if(!res.ok)
            {
                setRegisterError(await res.text())
            }else{
                setRegisterSuccess(true);
                setRegisterError(null);
            }})
    }

    return (
        <div className="register-process">
            {registerSuccess ? <RegisterSuccess/> : 
            <RegisterForm 
                onSubmitHandler={onSubmitHandler} 
                registerError={registerError}
                setSelectedDate={setSelectedDate}/>}
        </div>
    )
}

export default Register;
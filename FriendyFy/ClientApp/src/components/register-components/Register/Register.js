import React, { useEffect } from "react";
import { useState } from "react";
import "./Register.css"
import "react-datetime/css/react-datetime.css";
import RegisterSuccess from "../RegisterSuccess/RegisterSuccess";
import RegisterForm from "../RegisterForm/RegisterForm";
import { register } from "../../../services/userService";
import { useThemeContext } from "../../../contexts/ThemeContext";

const Register = ({ setPopUpText }) => {

    const [registerError, setRegisterError] = useState(null);
    const [selectedDate, setSelectedDate] = useState('');
    const [registerSuccess, setRegisterSuccess] = useState(false);
    const { theme } = useThemeContext();
    function onSubmitHandler(e) {
        e.preventDefault();
        register(e.target['first-name'].value, e.target['last-name'].value, selectedDate, e.target['gender'].value,
            e.target['password'].value, e.target['confirm-password'].value, e.target['email-input'].value, theme)
            .then(async res => {
                if (!res.ok) {
                    setRegisterError(await res.text())
                } else {
                    setRegisterSuccess(true);
                    setRegisterError(null);
                }
            })
    }

    useEffect(() => {
        if (registerSuccess) {
            setPopUpText('You successfully registered!')
        }
    }, [registerSuccess])

    return (
        <div className="register-process">
            {registerSuccess ? <RegisterSuccess /> :
                <RegisterForm
                    onSubmitHandler={onSubmitHandler}
                    registerError={registerError}
                    setSelectedDate={setSelectedDate} />}
        </div>
    )
}

export default Register;
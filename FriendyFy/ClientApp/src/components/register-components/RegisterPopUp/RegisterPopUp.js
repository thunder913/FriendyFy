import React from 'react';
import './RegisterPopUp.css';
import Register from "../Register/Register";

const RegisterPopUp = (props) =>(
    <div className="register-popup">
        <a className="close" onClick={() => props.setShowRegister(false)}/>
        <h2>Register now!</h2>
        <Register/>
    </div>
    )

export default RegisterPopUp
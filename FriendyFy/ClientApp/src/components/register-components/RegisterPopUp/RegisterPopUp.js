import React from 'react';
import './RegisterPopUp.css';
import Register from "../Register/Register";

const RegisterPopUp = (props) =>(
    <div className="register-popup">
        <a className="close" onClick={() => props.setShowRegister(false)}/>
        <Register/>
    </div>
    )

export default RegisterPopUp
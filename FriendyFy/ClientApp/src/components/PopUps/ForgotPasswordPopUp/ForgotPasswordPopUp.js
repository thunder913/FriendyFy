import React, { useState } from "react";
import './ForgotPasswordPopUp.css'
import PopUp from "../PopUp";
import PopUpHeader from "../PopUpHeader/PopUpHeader";
import { forgotPassword } from "../../../services/userService";
import IsEmail from "isemail";

// notification
const ForgotPasswordPopUp = ({show, setShow}) => {
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const forgotPasswordEvent = () => {
        if(!IsEmail.validate(email)){
            setError('The email is not valid')
        }else{
            forgotPassword(email)
                .then(res => {
                    if(res.status === 200){
                        setShow(false)
                    }else{
                        setError('There was an error with your request, try again!');
                    }
                })
        }
    }

    return (
        <PopUp show={show} setShow={setShow} escClose={true}>
            <div className="popup-outer">
                <div className="popup-inner forgot-password">
                    <PopUpHeader title="Reset your password" closePopUp={() => setShow(false)}></PopUpHeader>
                    <p className="error-message">{error}</p>
                    <input type="text" placeholder="Email" onChange={e => setEmail(e.target.value)}/>
                    <button onClick={forgotPasswordEvent}>Reset</button>
                </div>
            </div>
        </PopUp>
    )
}

export default ForgotPasswordPopUp;
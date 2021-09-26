import React from "react";
import RegisterNameInput from "../RegisterNameInput/RegisterNameInput.js";
import RegisterEmailField from "../RegisterEmailField/RegisterEmailField";
import RegisterBirthday from "../RegisterBirthday/RegisterBirthday";
import RegisterGender from "../RegisterGender/RegisterGender";
import RegisterPasswords from "../RegisterPasswords/RegisterPasswords";

const RegisterForm = ({onSubmitHandler, registerError, setSelectedDate}) => {
    return(
    <form className="register" onSubmit={onSubmitHandler}>
            <h2>Register now!</h2>
            {registerError ? <span className='register-error'>{registerError}</span>: ''}
            <RegisterNameInput/>
            <RegisterEmailField/>
            <div className="bottom-row">
                <RegisterBirthday setSelectedDate={setSelectedDate}/>
               <RegisterGender/>
            </div>
            <RegisterPasswords/>
        <p className="tos">By clicking <strong>Register</strong>, you agree to our Terms. Learn how we collect, use and share your data in our Data Policy and how we use cookies and similar technology in our Cookies Policy. You may receive Emails from us and can opt out any time.</p>
            <input id="register-button" type="submit" value="Register" />
        </form>)
}

export default RegisterForm;
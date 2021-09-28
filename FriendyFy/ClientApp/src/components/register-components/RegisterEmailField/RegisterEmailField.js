import React, { useState, useEffect} from 'react'
import InputWithValidation from '../../InputWithValidation/InputWithValidation';
import './RegisterEmailField.css'
import Isemail from 'isemail'

const RegisterEmailField = () => {
    const [email, setEmail] = useState('');
    const [emailError, setEmailError] = useState(null);
    const [emailErrorBubble, setEmailErrorBubble] = useState(false);
    const [firstLoad, setFirstLoad] = useState(true);
    
    function onEmailChangeHandler(e) {
        setEmail(e.target.value);
    }
    useEffect(() => {
        function emailValidation(){
            if(!Isemail.validate(email)){
                setEmailError('The email is invalid!');
            }
            else{
                setEmailError(null)
            }
        }

        if(!firstLoad){
        const timeoutId = setTimeout(() =>{ 
            emailValidation()}
            , 500);
        return () => clearTimeout(timeoutId);
        }
        setFirstLoad(false);
    }, [email]);

    return (
    <InputWithValidation
        error = {emailError}
        placeholder = 'Email'
        value = {email}
        changeHandler = {onEmailChangeHandler}
        setErrorBubble = {setEmailErrorBubble}
        errorBubble = {emailErrorBubble}
        id="email-input"
    />)

}

export default RegisterEmailField;

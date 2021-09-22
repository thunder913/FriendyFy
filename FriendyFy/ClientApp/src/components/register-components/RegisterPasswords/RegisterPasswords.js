import React, {useState, useEffect} from 'react'
import InputWithValidation from '../../InputWithValidation/InputWithValidation';
import './RegisterPasswords.css'
const RegisterPasswords = () => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordError, setPasswordError] = useState(null);
    const [passwordErrorBubble, setPasswordErrorBubble] = useState(false);
    const [confirmPasswordError, setConfirmPasswordError] = useState(null);
    const [confirmPasswordErrorBubble, setConfirmPasswordErrorBubble] = useState(false);
    const [firstLoad, setFirstLoad] = useState(true);

    function passwordValidation(){
        if(!password.match(/\d/)){
            setPasswordError('The password must contain a number!');
        }else if(password.length < 8){
            setPasswordError('The password must be at least 8 characters long!');
        }else if(!password.match(/[A-Z]/)){
            setPasswordError('The password must have an upper cased letter!');
        }
        else{
            if(confirmPassword.length){
                confirmPasswordValidation();
            }
            setPasswordError(null)
        }
    }

    function confirmPasswordValidation(){
        if(password !== confirmPassword){
            setConfirmPasswordError('The passwords must match!')
        }
        else{
            setConfirmPasswordError(null)
        }
    }

    useEffect(() => {
        if(!firstLoad){
        const timeoutId = setTimeout(() =>{ 
            passwordValidation()}
            , 500);
        return () => clearTimeout(timeoutId);
        }
        setFirstLoad(false);
    }, [password]);

    useEffect(() => {
        if(!firstLoad){
            const timeoutId = setTimeout(() =>{ 
                confirmPasswordValidation()}
                , 500);
            return () => clearTimeout(timeoutId);
            }
    },[confirmPassword])

    function onPasswordChange(e){
        setPassword(e.target.value);
    }

    function onConfirmPasswordChange(e){
        setConfirmPassword(e.target.value);
    }

    return(
        <div className="passwords">
            <InputWithValidation
                id="password"
                type="password"
                error = {passwordError}
                placeholder = 'Password'
                value = {password}
                changeHandler = {onPasswordChange}
                setErrorBubble = {setPasswordErrorBubble}
                errorBubble = {passwordErrorBubble}
            />
                        <InputWithValidation
                id="confirm-password"
                type="password"
                error = {confirmPasswordError}
                placeholder = 'Confirm Password'
                value = {confirmPassword}
                changeHandler = {onConfirmPasswordChange}
                setErrorBubble = {setConfirmPasswordErrorBubble}
                errorBubble = {confirmPasswordErrorBubble}
            />
        </div>
    )
}

export default RegisterPasswords;
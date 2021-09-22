import './RegisterNameInput.css'
import React, {useState} from 'react';
import { useEffect } from 'react/cjs/react.development';



const RegisterNameInput = () => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [firstNameError, setFirstNameError] = useState(null);
    const [lastNameError, setLastNameError] = useState(null);
    const [firstLoad, setFirstLoad] = useState(true);

    const letterRegex = /^[A-Za-z\u00C0-\u1FFF\u2800-\uFFFD ]+$/;

    function onFirstNameChangeHandler(e) {
        setFirstName(e.target.value);
    }
    
    function onLastNameChangeHandler(e) {
        setLastName(e.target.value);
    }

    function firstNameValidation(){
        if(firstName.length > 50){
            setFirstNameError('First name cannot be longer than 50 characters!');
        }else if(firstName.length < 2){
            setFirstNameError('The first name must be at least 2 characters long!');
        }
        else if(!firstName.match(letterRegex)){
            setFirstNameError('The first name must contain only letters!');
        }
        else{
            setFirstNameError(null)
        }
    }

    function lastNameValidation(){
        if(lastName.length > 50){
            setLastNameError('Last name cannot be longer than 50 characters!');
        }else if(lastName.length < 2){
            setLastNameError('The last name must be at least 2 characters long!');
        }
        else if(!lastName.match(letterRegex)){
            setLastNameError('The last name must contain only letters!');
        }
        else{
            setLastNameError(null)
        }
    }

    useEffect(() => {
        if(!firstLoad){
        const timeoutId = setTimeout(() =>{ 
            firstNameValidation()}
            , 500);
        return () => clearTimeout(timeoutId);
        }
        setFirstLoad(false);
    }, [firstName]);

    useEffect(() => {
        if(!firstLoad){
        const timeoutId = setTimeout(() =>{ 
            lastNameValidation()}
            , 500);
        return () => clearTimeout(timeoutId);
        }
    }, [lastName]);

    return(
    <div className="names">
    <input id="first-name" className={firstNameError != null ? 'error' : ''} type="text" placeholder="First Name" value={firstName} onChange={onFirstNameChangeHandler} />
    <input id="last-name" className={lastNameError != null ? 'error' : ''} type="text" placeholder="Last Name" value={lastName} onChange={onLastNameChangeHandler} />
    </div>)
}

export default RegisterNameInput;
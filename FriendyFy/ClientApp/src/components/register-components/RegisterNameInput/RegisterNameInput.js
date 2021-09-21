import './RegisterNameInput.css'
import React, {useState} from 'react';



const RegisterNameInput = () => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');

    function onFirstNameChangeHandler(e) {
        setFirstName(e.target.value);
    }
    
    function onLastNameChangeHandler(e) {
        setLastName(e.target.value);
    }

    return(
    <div className="names">
    <input id="first-name" type="text" placeholder="First Name" value={firstName} onChange={onFirstNameChangeHandler} />
    <input id="last-name" type="text" placeholder="Last Name" value={lastName} onChange={onLastNameChangeHandler} />
    </div>)
}

export default RegisterNameInput;
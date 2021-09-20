import React from "react";
import { useState } from "react";


const Register = () => {
    const [email, setEmail] = useState('ta');

    function onSubmitHandler(e){
        e.preventDefault();
        console.log(email)
    }

    function onChangeHandler(e){
        setEmail(e.target.value);
        console.log(e.target.value);
        console.log(email)
        setTimeout(() => {
            console.log('This is delayed mail:' + email)
        }, 1000);
    }

    return(
        <form onSubmit={onSubmitHandler}>
            <label htmlFor="email">Email:</label>
            <input type="text" value={email} onChange={e => onChangeHandler(e)} />
            <input type="submit" vlaue="Submit" />
        </form>
    )
}

export default Register;
import React, { useState} from 'react'

const RegisterEmailField = () => {
    const [email, setEmail] = useState('');

    function onEmailChangeHandler(e) {
        setEmail(e.target.value);
    }
    return <input id="email" type="text" value={email} placeholder="example@mail.com" onChange={onEmailChangeHandler} />
}

export default RegisterEmailField;

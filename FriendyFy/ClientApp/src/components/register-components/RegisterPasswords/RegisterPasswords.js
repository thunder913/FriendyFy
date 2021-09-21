import React, {useState} from 'react'

const RegisterPasswords = () => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    
    function onPasswordChange(e){
        setPassword(e.target.value);
    }

    function onConfirmPasswordChange(e){
        setConfirmPassword(e.target.value);
    }

    return(
        <div className="passwords">
                <input id="password" type="password" placeholder="Password" value={password} onChange={onPasswordChange} />
                <input id="confirm-password" type="password" placeholder="Confirm Password" value={confirmPassword} onChange={onConfirmPasswordChange} />
        </div>
    )
}

export default RegisterPasswords;
import React, { useEffect, useState } from "react";
import { resetPassword } from "../../services/userService";
import PageLoading from "../PageLoading/PageLoading";
import './ResetPassword.css'
import { useLocation } from "react-router";
import { NotificationManager } from 'react-notifications';
const ResetPassword = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [error, setError] = useState('');
    const params = useLocation().search;
    const code = new URLSearchParams(params).get("code");

    function confirmPasswordValidation() {
        if (password !== confirmPassword) {
            setError('The passwords must match!')
        }
        else {
            setError(null)
        }
    }

    function passwordValidation() {
        if (!password.match(/\d/)) {
            setError('The password must contain a number!');
        } else if (password.length < 8) {
            setError('The password must be at least 8 characters long!');
        } else if (!password.match(/[A-Z]/)) {
            setError('The password must have an upper cased letter!');
        }
        else if (confirmPassword.length) {
            confirmPasswordValidation();
        } else {
            setError(null)
            return true;
        }

        return true;
    }


    const resetPasswordEvent = () => {
        let validated = passwordValidation();
        if (validated) {
            resetPassword(email, password, confirmPassword, code)
                .then(async (res) => {
                    if (res.status === 200) {
                        NotificationManager.success('Successfully changed the password!', '', 2000);
                    } else {
                        NotificationManager.error(await res.text(), '', 2000);
                    }
                });
        }
    }

    useEffect(() => {
        if(error){
            NotificationManager.error(error, '', 5000);
        }
    }, [error])

    return (
        <PageLoading>
            <div className="reset-password">
                <h2>Reset password</h2>
                <div className="top-texts">
                    <p>In order to reset the password, please fill the details bellow.</p>
                    <p>Please remember, that the password MUST contain a number, be at least 8 charactes long and have an upper cased letter</p>
                </div>
                <form className="reset-inputs" >
                    <input type="text" placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
                    <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
                    <input type="password" placeholder="Confirmed Password" onChange={(e) => setConfirmPassword(e.target.value)} />
                    <button type="button" onClick={() => resetPasswordEvent()}>Reset</button>
                </form>
            </div>
        </PageLoading>
    )
}

export default ResetPassword;
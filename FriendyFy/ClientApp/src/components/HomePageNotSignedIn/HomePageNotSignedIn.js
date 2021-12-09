import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useLoggedIn } from "../../contexts/LoggedInContext";
import RegisterPopUp from "../register-components/RegisterPopUp/RegisterPopUp";
import {getLoggedInUser, confirmEmail} from '../../services/userService.js';
import { useLocation } from "react-router";
import './HomePageNotSignedIn.css'

const HomePageNotSignedIn = () =>{

    const [showRegister, setShowRegister] = useState(false);
    const [showEmailConfirmed, setShowEmailConfirmed] = useState(false);
    const {setLoggedIn} = useLoggedIn();
    const [loginError, setLoginError] = useState(null);
    const params = useLocation().search;
    const userId = new URLSearchParams(params).get("userId");
    const code = new URLSearchParams(params).get("code");

    useEffect(() => {
      if(userId && code){
          confirmEmail(userId, code)
            .then(res => {
                if(res.ok)
                {
                    setShowEmailConfirmed(true);
                }
            })}
    },[code, userId]);

    function onSubmitHandler(e){
        e.preventDefault();
        fetch('/api/login', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(
                {
                    email: e.target['email'].value,
                    password: e.target['password'].value
                })
        })
        .then(res => {
            if(res.ok){
                getLoggedInUser().then(async res => {
                    if(res.ok){
                        setLoggedIn((await res.json()));
                        setLoginError(null);
                        setShowEmailConfirmed(false);
                    }
                });
            }else{
                setLoginError('You have entered an invalid email or password, try again');
            }
        });
    }

    return (
    <div className="home-page" >
        <div className="page" style={{ filter: showRegister ? 'blur(5px)' : '' }}>
            <div className="register-top">
                <div className="top-logo">
                    <img src={require('../../static/logo.png')} alt="" />
                </div>
                <div className="logo-text">
                    <img src={require('../../static/text.png')} alt="" />
                </div>
                <h2 className="home-quote">Connect with people on FriendFy. Meet new people and have the best time of your life!</h2>
            </div>
            <div className="register-bottom">
                <div className="login-container">
                    <h3 className="activation-message">{showEmailConfirmed ? 'Your account was activated successfully.' : ''}</h3>
                    <h3 className="login-error">{loginError ?? ''}</h3>
                    <form onSubmit={onSubmitHandler}>
                    <input id="email" type="text" placeholder="Email"/>
                    <input id="password" type="password" placeholder="Password"/>
                    <div className="login-buttons">
                        <Link className="forgotten-password" to="#">Forgot Password?</Link>
                        <input className="login-button" type="submit" value="Login"/>
                    </div>
                    </form>
                </div>
                <div className="create-account">
                    <h3 className="join-our-community">Join our comunity now ↓↓</h3>
                    <button className="register" onClick={() => setShowRegister(true)}>
                        <span>
                        Create New Account
                        </span>
                    </button>
                </div>
            </div>
        </div>
        <RegisterPopUp show={showRegister} setShow={setShowRegister}/>
    </div>);
}

export default HomePageNotSignedIn;
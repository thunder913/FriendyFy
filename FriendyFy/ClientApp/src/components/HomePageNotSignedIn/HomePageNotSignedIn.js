import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useLoggedIn } from "../../contexts/LoggedInContext";
import RegisterPopUp from "../register-components/RegisterPopUp/RegisterPopUp";
import {getLoggedInUser} from '../../services/userService.js'
import './HomePageNotSignedIn.css'

const HomePageNotSignedIn = () =>{

    const [showRegister, setShowRegister] = useState('');
    const {loggedIn, setLoggedIn} = useLoggedIn();

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
                    if(res.status === '200'){
                        let user = await res.json();
                        setLoggedIn(user.id);
                    }
                });
            }
        });
    }

    return (
    <div className="home-page" >
        <div className="page" style={{ filter: showRegister ? 'blur(5px)' : '' }}>
            <div className="register-top">
                <h1>FRIENDYFY</h1>
                <h2 className="home-quote">Connect with people on FriendFy. Meet new people and have the best time of your life!</h2>
            </div>
            <div className="register-bottom">
                <div className="login-container">
                    <form onSubmit={onSubmitHandler}>
                    <input id="email" type="text" placeholder="Email"/>
                    <input id="password" type="text" placeholder="Password"/>
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
            {/* <input type="submit" onClick={() => setShowRegister(!showRegister)}/> */}
        </div>
        {showRegister ? 
                <RegisterPopUp setShowRegister={setShowRegister}/>
 : ''}
    </div>);
}

export default HomePageNotSignedIn;
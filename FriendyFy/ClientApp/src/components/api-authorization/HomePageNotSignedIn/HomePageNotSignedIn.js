import React, { useState } from "react";
import RegisterPopUp from "../../register-components/RegisterPopUp/RegisterPopUp";
import './HomePageNotSignedIn.css'
const HomePageNotSignedIn = () =>{

    const [showRegister, setShowRegister] = useState('');
    
    return (
    <div className="home-page" >
        <div className="page" style={{ filter: showRegister ? 'blur(5px)' : '' }}>
            <h1>NOT SIGNED IN</h1>
            <input type="submit" onClick={() => setShowRegister(!showRegister)}/>
        </div>

        {showRegister ? <RegisterPopUp setShowRegister={setShowRegister}/> : ''}
    </div>);
}

export default HomePageNotSignedIn;
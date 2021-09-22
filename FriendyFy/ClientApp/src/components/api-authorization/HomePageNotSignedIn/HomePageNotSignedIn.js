import React, { useState } from "react";
import RegisterPopUp from "../../register-components/RegisterPopUp/RegisterPopUp";
import './HomePageNotSignedIn.css'
const HomePageNotSignedIn = () =>{

    const [showRegister, setShowRegister] = useState('');
    
    return (<div className="home-page" style={{ filter: showRegister ? 'blur(10px)' : '' }}>
        <h1>NOT SIGNED IN</h1>
        <input type="submit" onClick={() => setShowRegister(!showRegister)}/>
        {showRegister ? <RegisterPopUp /> : ''}
    </div>);
}

export default HomePageNotSignedIn;
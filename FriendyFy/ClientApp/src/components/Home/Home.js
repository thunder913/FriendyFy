import React, {useContext, useEffect} from 'react';
import { useState } from 'react';
import './Home.css';
import RegisterPopUp from '../register-components/RegisterPopUp/RegisterPopUp';
import HomePageNotSignedIn from '../api-authorization/HomePageNotSignedIn/HomePageNotSignedIn';
import HomePageSignedIn from '../HomePageSignedIn/HomePageSignedIn';
import { LoggedInContext } from '../../contexts/LoggedInContext.js'
const Home = () => {

  const loggedIn = useContext(LoggedInContext);

  useEffect(() => 
    fetch("https://localhost:44323/Test/")
      .then(res => res.json())
      .then(res => {
          // Do something with the result
      })
  );

    return (
      <div className="home-page">
        {loggedIn ? 
        <HomePageSignedIn/>
        :
        <HomePageNotSignedIn/>
        }
      </div>

    );
  }

  export default Home;
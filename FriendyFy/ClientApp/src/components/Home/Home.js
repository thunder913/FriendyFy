import React, {useContext, useEffect} from 'react';
import { useState } from 'react';
import './Home.css';
import HomePageNotSignedIn from '../HomePageNotSignedIn/HomePageNotSignedIn'
import HomePageSignedIn from '../HomePageSignedIn/HomePageSignedIn';
import { useLoggedIn } from '../../contexts/LoggedInContext.js'
const Home = () => {

  useEffect(() => 
    fetch("https://localhost:44323/Test/")
      .then(res => res.json())
      .then(res => {
          // Do something with the result
      })
  );

    return (
      <div className="home-page">
        <HomePageSignedIn/>
      </div>

    );
  }

  export default Home;
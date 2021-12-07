import React from 'react';
import './Home.css';
import HomePageSignedIn from '../HomePageSignedIn/HomePageSignedIn';
import HomePageNotSignedIn from '../HomePageNotSignedIn/HomePageNotSignedIn';
import { useLoggedIn } from '../../contexts/LoggedInContext';
const Home = () => {
  const {loggedIn} = useLoggedIn();
  return !loggedIn ? (<HomePageNotSignedIn />) : (
      <div className="home-page">
        <HomePageSignedIn />
      </div>
    );
  }

export default Home;
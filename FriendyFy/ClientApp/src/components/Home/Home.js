import React, {useEffect} from 'react';
import './Home.css';
import HomePageSignedIn from '../HomePageSignedIn/HomePageSignedIn';
const Home = () => {

    return (
      <div className="home-page">
        <HomePageSignedIn/>
      </div>

    );
  }

  export default Home;
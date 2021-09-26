import React, {useEffect} from 'react';
import './Home.css';
import HomePageSignedIn from '../HomePageSignedIn/HomePageSignedIn';
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
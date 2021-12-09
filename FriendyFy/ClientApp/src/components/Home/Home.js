import React from 'react';
import './Home.css';
import HomePageSignedIn from '../HomePageSignedIn/HomePageSignedIn';
import HomePageNotSignedIn from '../HomePageNotSignedIn/HomePageNotSignedIn';
import { useLoggedIn } from '../../contexts/LoggedInContext';
import PageLoading from '../PageLoading/PageLoading';
const Home = () => {
  const { loggedIn } = useLoggedIn();
  return <PageLoading>
    {!loggedIn ? (<HomePageNotSignedIn />) : (
      <div className="home-page">
        <HomePageSignedIn />
      </div>
    )}
  </PageLoading>
}

export default Home;
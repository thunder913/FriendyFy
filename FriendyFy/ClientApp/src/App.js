import React, { useEffect } from 'react';
import { Route } from 'react-router';
import { Layout } from './components/Layout/Layout';
import Home from './components/Home/Home';
import ApiAuthorizationRoutes from './components/api-authorization/ApiAuthorizationRoutes';
import { ApplicationPaths } from './components/api-authorization/ApiAuthorizationConstants';
import Profile from './components/Profile/Profile';
import './custom.css'
import Friends from './components/Friends/Friends';
import ProfilePhotos from './components/ProfilePhotos/ProfilePhotos';
import Register from './components/register-components/Register/Register.js';
import HomePageNotSignedIn from './components/HomePageNotSignedIn/HomePageNotSignedIn';
import {useLoggedIn} from './contexts/LoggedInContext.js'


function App(){
  const {loggedIn, resetUser} = useLoggedIn();

  // Make this async if anything fails anywhere
  useEffect(() => {
    resetUser();
  }, [])

  return (
              <Layout>
              {!loggedIn ? (<HomePageNotSignedIn/>) : (
                <div className="app">
                  <Route path={["/profile", "/friends", "/photos"]} component={Profile}></Route>
                  <Route path="/register" component={Register}></Route>
                  <Route path={ApplicationPaths.ApiAuthorizationPrefix} component={ApiAuthorizationRoutes} />
                  <Route exact path='/' component={Home} />
                </div>
              )}

            </Layout>
    );
  }

  export default App;
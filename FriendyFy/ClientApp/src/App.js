import React, { useEffect } from 'react';
import { Route, Switch } from 'react-router';
import { Layout } from './components/Layout/Layout';
import Home from './components/Home/Home';
import ApiAuthorizationRoutes from './components/api-authorization/ApiAuthorizationRoutes';
import { ApplicationPaths } from './components/api-authorization/ApiAuthorizationConstants';
import Profile from './components/Profile/Profile';
import './custom.css'
import Event from './components/Event/Event'
import Register from './components/register-components/Register/Register.js';
import { useLoggedIn } from './contexts/LoggedInContext.js'
import { useState } from 'react/cjs/react.development';
import { AnimatePresence } from "framer-motion/dist/es/index.js";
import { useLocation } from 'react-router';
import AwaitLoggedInTransitionPopUp from './components/PopUps/AwaitLoggedInTransitionPopUp/AwaitLoggedInTransitionPopUp';
function App() {
  const { loggedIn, resetUser } = useLoggedIn();
  const [showLoader, setShowLoader] = useState(false);
  const location = useLocation();
  // Make this async if anything fails anywhere
  useEffect(() => {
    setShowLoader(true);
    resetUser()
      .then(() => setTimeout(() => {
        setShowLoader(false)
      }, 1000));
  }, [])

  return (
    <Layout>
      {showLoader ? <AwaitLoggedInTransitionPopUp show={showLoader} setShow={setShowLoader}/> : ''}
      <AnimatePresence exitBeforeEnter>
        <Switch location={location} key={location.pathname} className="app">
          <Route path={["/profile", "/friends", "/photos"]} component={Profile}></Route>
          <Route path="/register" component={Register}></Route>
          <Route path="/event" component={Event}></Route>
          <Route path={ApplicationPaths.ApiAuthorizationPrefix} component={ApiAuthorizationRoutes} />
          <Route exact path='/' component={Home} />
        </Switch>
      </AnimatePresence>
    </Layout>
  );
}

export default App;
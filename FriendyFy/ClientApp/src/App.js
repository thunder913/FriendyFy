import React, { useEffect, useState } from 'react';
import { Route, Switch } from 'react-router';
import { Layout } from './components/Layout/Layout';
import Home from './components/Home/Home';
import ApiAuthorizationRoutes from './components/api-authorization/ApiAuthorizationRoutes';
import { ApplicationPaths } from './components/api-authorization/ApiAuthorizationConstants';
import Profile from './components/Profile/Profile';
import './custom.css'
import Event from './components/Event/Event'
import { useLoggedIn } from './contexts/LoggedInContext.js'
import { AnimatePresence } from "framer-motion/dist/es/index.js";
import { useLocation } from 'react-router';
import AwaitLoggedInTransitionPopUp from './components/PopUps/AwaitLoggedInTransitionPopUp/AwaitLoggedInTransitionPopUp';
import Settings from './components/Settings/Settings';
import Privacy from './components/Privacy/Privacy';
import TermsOfService from './components/TermsOfService/TermsOfService';
import Cookies from './components/Cookies/Cookies';
import ResetPassword from './components/ResetPassword/ResetPassword';
import SearchPage from './components/SearchPage/SearchPage';
import NotFound from './components/NotFound/NotFound';
import { useChatConnection } from './contexts/chatConnectionContext';
import { useNotificationConnection } from './contexts/NotificationContext';
import NotificationContainer from 'react-notifications/lib/NotificationContainer';

function App() {
  const [showLoader, setShowLoader] = useState(true);
  const { loggedIn, resetUser } = useLoggedIn();
  const location = useLocation();
  const { openConnection: openChatConnection, closeConnection: closeChatConnection, connection: chatConnection } = useChatConnection();
  const { openConnection: openNotificationConnection, closeConnection: closeNotificationConnection, connection: notificationConnection } = useNotificationConnection();

  const openConnections = () => {
    if (loggedIn) {
      if (!chatConnection || chatConnection.connectionState === 'Disconnected')
        openChatConnection();
    }
    if (!notificationConnection || notificationConnection.connectionState === 'Disconnected') {
      openNotificationConnection();
    }
  }

  useEffect(() => {
    setShowLoader(true);
    resetUser()
      .then(() => setTimeout(() => {
        setShowLoader(false)
      }, 1000));
  }, [])

  useEffect(() => {
    openConnections();
  }, [])

  useEffect(() => {
    if (!loggedIn) {
      closeChatConnection();
      closeNotificationConnection();
    } else {
      openConnections();
    }
  }, [loggedIn])

  return (
    <Layout>
      <NotificationContainer />
      <AwaitLoggedInTransitionPopUp show={showLoader} setShow={setShowLoader} />
      <AnimatePresence exitBeforeEnter>
        <Switch location={location} key={location.pathname} className="app">
          <Route path={["/profile", "/friends", "/photos"]} component={Profile}></Route>
          <Route path="/event" component={Event}></Route>
          <Route path="/settings" component={Settings}></Route>
          <Route path="/privacy" component={Privacy}></Route>
          <Route path="/cookies" component={Cookies}></Route>
          <Route path="/tos" component={TermsOfService}></Route>
          <Route path="/search-page" component={SearchPage}></Route>
          <Route path={ApplicationPaths.ApiAuthorizationPrefix} component={ApiAuthorizationRoutes} />
          <Route exact path={['/', '/Auth/Register']} component={Home} />
          <Route path='/Auth/SendForgottenPasswordEmail' component={ResetPassword} />
          <Route component={NotFound}></Route>
        </Switch>
      </AnimatePresence>
    </Layout>
  );
}

export default App;
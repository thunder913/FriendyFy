import React, { Component } from 'react';
import { Route } from 'react-router';
import { Layout } from './components/Layout/Layout';
import Home from './components/Home/Home';
import AuthorizeRoute from './components/api-authorization/AuthorizeRoute';
import ApiAuthorizationRoutes from './components/api-authorization/ApiAuthorizationRoutes';
import { ApplicationPaths } from './components/api-authorization/ApiAuthorizationConstants';
import Profile from './components/Profile/Profile';
import './custom.css'
import Friends from './components/Friends/Friends';
import ProfilePhotos from './components/ProfilePhotos/ProfilePhotos';
import Register from './components/register-components/Register/Register.js';
import { LoggedInProvider } from './contexts/LoggedInContext.js'

export default class App extends Component {
  static displayName = App.name;

  render () {
    return (
      <LoggedInProvider>
      <Layout>
        <Route exact path='/' component={Home} />
        <Route path="/profile" component={Profile}></Route>
        <Route path="/friends" component={Friends}></Route>
        <Route path="/photos" component={ProfilePhotos}></Route>
        <Route path="/register" component={Register}></Route>
        <Route path={ApplicationPaths.ApiAuthorizationPrefix} component={ApiAuthorizationRoutes} />
      </Layout>
      </LoggedInProvider>
    );
  }
}

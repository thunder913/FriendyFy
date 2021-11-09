import React from 'react';
import { Container } from 'reactstrap';
import { useLoggedIn } from '../../contexts/LoggedInContext.js'
import Footer from '../Footer/Footer';
import LeftNavigation from '../LeftNavigation/LeftNavigation';
import NavMenu from '../NavMenu/NavMenu';
import RightNavigation from '../RightNavigation/RightNavigation';
import './Layout.css'

export const Layout = (props) => {
  const {loggedIn} = useLoggedIn();

    return (
      <div className="site">
        {loggedIn ? <NavMenu /> : ''}
        {loggedIn ? <LeftNavigation/> : ''}
        <div className="main-content">
                <Container>
                  {props.children}
                </Container>
        </div>
        {loggedIn ? <RightNavigation/> : ''}
        {loggedIn ? <Footer/> : ''}
      </div>
    );
  }

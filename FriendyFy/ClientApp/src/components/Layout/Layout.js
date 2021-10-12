import React from 'react';
import { Container } from 'reactstrap';
import { useLoggedIn } from '../../contexts/LoggedInContext.js'
import Footer from '../Footer/Footer';
import LeftNavigation from '../LeftNavigation/LeftNavigation';
import NavMenu from '../NavMenu/NavMenu';
import RightNavigation from '../RightNavigation/RightNavigation';
import './Layout.css'
const users = [{name: "Georgi",image: "/static/media/testPhoto.c8119cb6.jpg", isOnline: false, hasUnreadMessages: false},
{name: "Georgi",image: "/static/media/testPhoto.c8119cb6.jpg", isOnline: false, hasUnreadMessages: true},
{name: "Ivan",image:  "/static/media/testPhoto.c8119cb6.jpg", isOnline: true, hasUnreadMessages: false},
{name: "Pesho",image: "/static/media/testPhoto.c8119cb6.jpg", isOnline: false, hasUnreadMessages: false},
{name: "Gosho",image: "/static/media/testPhoto.c8119cb6.jpg", isOnline: true, hasUnreadMessages: true},
{name: "Genadi",image: "/static/media/testPhoto.c8119cb6.jpg", isOnline: true, hasUnreadMessages: false},
{name: "Petran",image: "/static/media/testPhoto.c8119cb6.jpg", isOnline: true, hasUnreadMessages: true},
{name: "Dragan",image: "/static/media/testPhoto.c8119cb6.jpg", isOnline: false, hasUnreadMessages: true},
{name: "Petkan",image: "/static/media/testPhoto.c8119cb6.jpg", isOnline: true, hasUnreadMessages: false},
{name: "Georgi",image: "/static/media/testPhoto.c8119cb6.jpg", isOnline: false, hasUnreadMessages: true},
{name: "Ivan",image:  "/static/media/testPhoto.c8119cb6.jpg", isOnline: true, hasUnreadMessages: false},
{name: "Pesho",image: "/static/media/testPhoto.c8119cb6.jpg", isOnline: false, hasUnreadMessages: false},
{name: "Gosho",image: "/static/media/testPhoto.c8119cb6.jpg", isOnline: true, hasUnreadMessages: true},
{name: "Genadi",image: "/static/media/testPhoto.c8119cb6.jpg", isOnline: true, hasUnreadMessages: false},
{name: "Petran",image: "/static/media/testPhoto.c8119cb6.jpg", isOnline: true, hasUnreadMessages: true},
{name: "Dragan",image: "/static/media/testPhoto.c8119cb6.jpg", isOnline: false, hasUnreadMessages: true},
{name: "Petkan",image: "/static/media/testPhoto.c8119cb6.jpg", isOnline: true, hasUnreadMessages: false},
{name: "Shagan",image: "/static/media/testPhoto.c8119cb6.jpg", isOnline: true, hasUnreadMessages: true},
];

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
        {loggedIn ? <Footer people={users}/> : ''}
      </div>
    );
  }

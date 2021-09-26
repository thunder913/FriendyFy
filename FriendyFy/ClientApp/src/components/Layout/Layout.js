import React, { Component, useContext } from 'react';
import { Container } from 'reactstrap';
import { useLoggedIn } from '../../contexts/LoggedInContext.js'
import Footer from '../Footer/Footer';
import LeftNavigation from '../LeftNavigation/LeftNavigation';
import { NavMenu } from '../NavMenu/NavMenu';
import RightNavigation from '../RightNavigation/RightNavigation';
import './Layout.css'
const users = [{name: "Georgi",image: "https://scontent-sof1-1.xx.fbcdn.net/v/t1.6435-9/194957949_4334439429940720_5542816028295677772_n.jpg?_nc_cat=108&ccb=1-5&_nc_sid=09cbfe&_nc_ohc=V3_ba1SZUj0AX8zYiPW&_nc_ht=scontent-sof1-1.xx&oh=f5dcc1bbf0701abef7059bb4e060a129&oe=615B9954", isOnline: false, hasUnreadMessages: false},
{name: "Georgi",image: "https://scontent-sof1-1.xx.fbcdn.net/v/t1.6435-9/194957949_4334439429940720_5542816028295677772_n.jpg?_nc_cat=108&ccb=1-5&_nc_sid=09cbfe&_nc_ohc=V3_ba1SZUj0AX8zYiPW&_nc_ht=scontent-sof1-1.xx&oh=f5dcc1bbf0701abef7059bb4e060a129&oe=615B9954", isOnline: false, hasUnreadMessages: true},
{name: "Ivan",image:  "https://scontent-sof1-1.xx.fbcdn.net/v/t1.6435-9/194957949_4334439429940720_5542816028295677772_n.jpg?_nc_cat=108&ccb=1-5&_nc_sid=09cbfe&_nc_ohc=V3_ba1SZUj0AX8zYiPW&_nc_ht=scontent-sof1-1.xx&oh=f5dcc1bbf0701abef7059bb4e060a129&oe=615B9954", isOnline: true, hasUnreadMessages: false},
{name: "Pesho",image: "https://scontent-sof1-1.xx.fbcdn.net/v/t1.6435-9/194957949_4334439429940720_5542816028295677772_n.jpg?_nc_cat=108&ccb=1-5&_nc_sid=09cbfe&_nc_ohc=V3_ba1SZUj0AX8zYiPW&_nc_ht=scontent-sof1-1.xx&oh=f5dcc1bbf0701abef7059bb4e060a129&oe=615B9954", isOnline: false, hasUnreadMessages: false},
{name: "Gosho",image: "https://scontent-sof1-1.xx.fbcdn.net/v/t1.6435-9/194957949_4334439429940720_5542816028295677772_n.jpg?_nc_cat=108&ccb=1-5&_nc_sid=09cbfe&_nc_ohc=V3_ba1SZUj0AX8zYiPW&_nc_ht=scontent-sof1-1.xx&oh=f5dcc1bbf0701abef7059bb4e060a129&oe=615B9954", isOnline: true, hasUnreadMessages: true},
{name: "Genadi",image: "https://scontent-sof1-1.xx.fbcdn.net/v/t1.6435-9/194957949_4334439429940720_5542816028295677772_n.jpg?_nc_cat=108&ccb=1-5&_nc_sid=09cbfe&_nc_ohc=V3_ba1SZUj0AX8zYiPW&_nc_ht=scontent-sof1-1.xx&oh=f5dcc1bbf0701abef7059bb4e060a129&oe=615B9954", isOnline: true, hasUnreadMessages: false},
{name: "Petran",image: "https://scontent-sof1-1.xx.fbcdn.net/v/t1.6435-9/194957949_4334439429940720_5542816028295677772_n.jpg?_nc_cat=108&ccb=1-5&_nc_sid=09cbfe&_nc_ohc=V3_ba1SZUj0AX8zYiPW&_nc_ht=scontent-sof1-1.xx&oh=f5dcc1bbf0701abef7059bb4e060a129&oe=615B9954", isOnline: true, hasUnreadMessages: true},
{name: "Dragan",image: "https://scontent-sof1-1.xx.fbcdn.net/v/t1.6435-9/194957949_4334439429940720_5542816028295677772_n.jpg?_nc_cat=108&ccb=1-5&_nc_sid=09cbfe&_nc_ohc=V3_ba1SZUj0AX8zYiPW&_nc_ht=scontent-sof1-1.xx&oh=f5dcc1bbf0701abef7059bb4e060a129&oe=615B9954", isOnline: false, hasUnreadMessages: true},
{name: "Petkan",image: "https://scontent-sof1-1.xx.fbcdn.net/v/t1.6435-9/194957949_4334439429940720_5542816028295677772_n.jpg?_nc_cat=108&ccb=1-5&_nc_sid=09cbfe&_nc_ohc=V3_ba1SZUj0AX8zYiPW&_nc_ht=scontent-sof1-1.xx&oh=f5dcc1bbf0701abef7059bb4e060a129&oe=615B9954", isOnline: true, hasUnreadMessages: false},
{name: "Georgi",image: "https://scontent-sof1-1.xx.fbcdn.net/v/t1.6435-9/194957949_4334439429940720_5542816028295677772_n.jpg?_nc_cat=108&ccb=1-5&_nc_sid=09cbfe&_nc_ohc=V3_ba1SZUj0AX8zYiPW&_nc_ht=scontent-sof1-1.xx&oh=f5dcc1bbf0701abef7059bb4e060a129&oe=615B9954", isOnline: false, hasUnreadMessages: true},
{name: "Ivan",image:  "https://scontent-sof1-1.xx.fbcdn.net/v/t1.6435-9/194957949_4334439429940720_5542816028295677772_n.jpg?_nc_cat=108&ccb=1-5&_nc_sid=09cbfe&_nc_ohc=V3_ba1SZUj0AX8zYiPW&_nc_ht=scontent-sof1-1.xx&oh=f5dcc1bbf0701abef7059bb4e060a129&oe=615B9954", isOnline: true, hasUnreadMessages: false},
{name: "Pesho",image: "https://scontent-sof1-1.xx.fbcdn.net/v/t1.6435-9/194957949_4334439429940720_5542816028295677772_n.jpg?_nc_cat=108&ccb=1-5&_nc_sid=09cbfe&_nc_ohc=V3_ba1SZUj0AX8zYiPW&_nc_ht=scontent-sof1-1.xx&oh=f5dcc1bbf0701abef7059bb4e060a129&oe=615B9954", isOnline: false, hasUnreadMessages: false},
{name: "Gosho",image: "https://scontent-sof1-1.xx.fbcdn.net/v/t1.6435-9/194957949_4334439429940720_5542816028295677772_n.jpg?_nc_cat=108&ccb=1-5&_nc_sid=09cbfe&_nc_ohc=V3_ba1SZUj0AX8zYiPW&_nc_ht=scontent-sof1-1.xx&oh=f5dcc1bbf0701abef7059bb4e060a129&oe=615B9954", isOnline: true, hasUnreadMessages: true},
{name: "Genadi",image: "https://scontent-sof1-1.xx.fbcdn.net/v/t1.6435-9/194957949_4334439429940720_5542816028295677772_n.jpg?_nc_cat=108&ccb=1-5&_nc_sid=09cbfe&_nc_ohc=V3_ba1SZUj0AX8zYiPW&_nc_ht=scontent-sof1-1.xx&oh=f5dcc1bbf0701abef7059bb4e060a129&oe=615B9954", isOnline: true, hasUnreadMessages: false},
{name: "Petran",image: "https://scontent-sof1-1.xx.fbcdn.net/v/t1.6435-9/194957949_4334439429940720_5542816028295677772_n.jpg?_nc_cat=108&ccb=1-5&_nc_sid=09cbfe&_nc_ohc=V3_ba1SZUj0AX8zYiPW&_nc_ht=scontent-sof1-1.xx&oh=f5dcc1bbf0701abef7059bb4e060a129&oe=615B9954", isOnline: true, hasUnreadMessages: true},
{name: "Dragan",image: "https://scontent-sof1-1.xx.fbcdn.net/v/t1.6435-9/194957949_4334439429940720_5542816028295677772_n.jpg?_nc_cat=108&ccb=1-5&_nc_sid=09cbfe&_nc_ohc=V3_ba1SZUj0AX8zYiPW&_nc_ht=scontent-sof1-1.xx&oh=f5dcc1bbf0701abef7059bb4e060a129&oe=615B9954", isOnline: false, hasUnreadMessages: true},
{name: "Petkan",image: "https://scontent-sof1-1.xx.fbcdn.net/v/t1.6435-9/194957949_4334439429940720_5542816028295677772_n.jpg?_nc_cat=108&ccb=1-5&_nc_sid=09cbfe&_nc_ohc=V3_ba1SZUj0AX8zYiPW&_nc_ht=scontent-sof1-1.xx&oh=f5dcc1bbf0701abef7059bb4e060a129&oe=615B9954", isOnline: true, hasUnreadMessages: false},
{name: "Shagan",image: "https://scontent-sof1-1.xx.fbcdn.net/v/t1.6435-9/194957949_4334439429940720_5542816028295677772_n.jpg?_nc_cat=108&ccb=1-5&_nc_sid=09cbfe&_nc_ohc=V3_ba1SZUj0AX8zYiPW&_nc_ht=scontent-sof1-1.xx&oh=f5dcc1bbf0701abef7059bb4e060a129&oe=615B9954", isOnline: true, hasUnreadMessages: true},
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

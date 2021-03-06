import React from 'react';
import { Navbar } from 'reactstrap';
import { Link } from 'react-router-dom';
import './NavMenu.css';
import SearchBar from '../SearchBar/SearchBar';
import UserOptions from '../UserOptions/UserOptions';
import Notifications from '../Notifications/Notifications';
import UserHeader from '../UserHeader/UserHeader';
import { useLoggedIn } from '../../contexts/LoggedInContext';
function NavMenu() {

  const { loggedIn } = useLoggedIn();

  return (
    <header className="site-header">
      <Navbar className="navbar-expand-sm navbar-toggleable-sm ng-white bottom-border box-shadow" light>

        <div className="logo">
          {/* <Link to="/">
            <div className="logo-image">
              <img src={require('../../static/logo.png')} alt="" />
            </div>
          </Link> */}
          <Link to="/">
            <div className="logo-text">
              <img src={require('../../static/text.png')} alt="" />
            </div>
          </Link>
        </div>
        <SearchBar />
        <div className="nav-right">
          {loggedIn ? <UserHeader /> : ''}
          {loggedIn ? <Notifications /> : ''}
          {!loggedIn ? <Link className='search-page-button' to="/search-page">Search</Link> : ''}
          <UserOptions />
        </div>

        {/* <NavbarToggler onClick={this.toggleNavbar} className="mr-2" />
            <Collapse className="d-sm-inline-flex flex-sm-row-reverse" isOpen={!this.state.collapsed} navbar>
              <ul className="navbar-nav flex-grow">
                <NavItem>
                  <NavLink tag={Link} className="text-dark" to="/">Home</NavLink>
                </NavItem>
                <NavItem>
                  <NavLink tag={Link} className="text-dark" to="/counter">Counter</NavLink>
                </NavItem>
                <NavItem>
                  <NavLink tag={Link} className="text-dark" to="/fetch-data">Fetch data</NavLink>
                </NavItem>
                <LoginMenu>
                </LoginMenu>
              </ul>
            </Collapse> */}
      </Navbar>
    </header>
  );
}

export default NavMenu;
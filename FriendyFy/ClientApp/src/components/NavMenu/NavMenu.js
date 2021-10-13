import React from 'react';
import { Navbar, NavbarBrand } from 'reactstrap';
import { Link } from 'react-router-dom';
import './NavMenu.css';
import SearchBar from '../SearchBar/SearchBar';
import UserOptions from '../UserOptions/UserOptions';
import Notifications from '../Notifications/Notifications';
import UserHeader from '../UserHeader/UserHeader';
import { logout } from '../../services/userService'
import { useLoggedIn } from '../../contexts/LoggedInContext';

function NavMenu(props) {

  const {setLoggedIn} = useLoggedIn();

  const logoutUser = () => {
    logout()
      .then(async () => {
          await setLoggedIn(false);
      });
  }
  return (
    <header className="site-header">
      <Navbar className="navbar-expand-sm navbar-toggleable-sm ng-white bottom-border box-shadow" light>
        <NavbarBrand tag={Link} to="/">FriendyFy</NavbarBrand>
        <SearchBar />
        <div className="nav-right">
          <UserHeader />
          <Notifications />
          <UserOptions />
          <button onClick={logoutUser}>Logout</button>
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
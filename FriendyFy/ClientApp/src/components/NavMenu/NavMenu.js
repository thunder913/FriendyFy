import React, { Component } from 'react';
import { Collapse, Navbar, NavbarBrand, NavbarToggler, NavItem, NavLink } from 'reactstrap';
import { Link } from 'react-router-dom';
import { LoginMenu } from '../api-authorization/LoginMenu';
import './NavMenu.css';
import SearchBar from '../SearchBar/SearchBar';
import UserOptions from '../UserOptions/UserOptions';
import Notifications from '../Notifications/Notifications';
import UserHeader from '../UserHeader/UserHeader';

export class NavMenu extends Component {
  static displayName = NavMenu.name;

  constructor (props) {
    super(props);

    this.toggleNavbar = this.toggleNavbar.bind(this);
    this.state = {
      collapsed: true
    };
  }

  toggleNavbar () {
    this.setState({
      collapsed: !this.state.collapsed
    });
  }

  render () {
    return (
      <header className="site-header">
        <Navbar className="navbar-expand-sm navbar-toggleable-sm ng-white bottom-border box-shadow" light>
            <NavbarBrand tag={Link} to="/">FriendyFy</NavbarBrand>
            <SearchBar/>
            <UserHeader/>
            <Notifications/>
            <UserOptions/>
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
}

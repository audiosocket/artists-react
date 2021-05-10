import React from "react";
import './Header.scss';
import logo from '../../../../images/header-logo.svg';
import profile from '../../../../images/profile.jpg';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav'
import {NavLink, useHistory} from "react-router-dom";


function Header() {
  const history = useHistory();

  return (
    <header>
      <Navbar collapseOnSelect expand="lg" variant="dark" className="custom-nav">
        <Navbar.Brand href="#home"><img src={logo} alt="COMPANY LOGO"  className="" /></Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="mr-auto">

          </Nav>
          <Nav>
            <Nav>
              <NavLink
                className={window.location.pathname.toLowerCase().indexOf('/settings') > -1 ? "nav-link active" : "nav-link"}
                to={"/settings"}>
                Settings
              </NavLink>
            </Nav>
            <Nav.Link eventKey={2} href="mailto:info@audiosocket.com">
              Help
            </Nav.Link>
            <Nav.Link eventKey={3} onClick={() => {
                localStorage.removeItem("user");
                history.push("/login");
              }}>
              Sign out
            </Nav.Link>
            <Nav.Link eventKey={4} className="profile-pic">
              <img src={profile} alt="Profile Picture"  className="" />
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    </header>
  );
}

export default Header;

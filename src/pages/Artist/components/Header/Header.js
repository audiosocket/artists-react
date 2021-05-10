import React from "react";
import './Header.scss';
import logo from '../../../../images/header-logo.svg';
import profile from '../../../../images/profile.jpg';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav'


function Header() {
  return (
    <header>
      <Navbar collapseOnSelect expand="lg" variant="dark" className="custom-nav">
        <Navbar.Brand href="#home"><img src={logo} alt="COMPANY LOGO"  className="" /></Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="mr-auto">

          </Nav>
          <Nav>
            <Nav.Link href="#deets">Setting</Nav.Link>
            <Nav.Link eventKey={2} href="#memes">
              Help
            </Nav.Link>
            <Nav.Link eventKey={2} href="#memes">
              Sign out
            </Nav.Link>
            <Nav.Link eventKey={2} href="#memes" className="profile-pic">
              <img src={profile} alt="Profile Picture"  className="" />
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    </header>
  );
}

export default Header;

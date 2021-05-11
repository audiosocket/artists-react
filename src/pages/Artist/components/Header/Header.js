import React, {useState} from "react";
import './Header.scss';
import logo from '../../../../images/header-logo.svg';
import profile from '../../../../images/profile.jpg';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav'
import NavDropdown from 'react-bootstrap/NavDropdown'
import {NavLink, useHistory} from "react-router-dom";
import {ArtistContext} from "../../../../Store/artistContext";

function Header() {
  const history = useHistory();
  const {artistState, artistActions} = React.useContext(ArtistContext);
  const [selectedArtist, setSelectedArtist] = useState(null);

  const initializeArtist = () => {

  }

  const handleSelectedArtist = (e) => {
    artistActions.selectedArtistStateChanged(e.target.dataset.value);
    setSelectedArtist(e.target.dataset.value);
  }
  return (
    <header>
      <Navbar collapseOnSelect expand="lg" variant="dark" className="custom-nav">
        <Navbar.Brand href="#home"><img src={logo} alt="COMPANY LOGO"  className="" /></Navbar.Brand>
        <Navbar.Text>{selectedArtist && selectedArtist+"'s Portal"}</Navbar.Text>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="mr-auto">
            <NavDropdown title={"Choose artist"} id="collasible-nav-dropdown" className="artist-dropdown">
              <NavDropdown.Item onClick={handleSelectedArtist} className={selectedArtist === 'Amanda' && "active"} data-value="Amanda">Amanda</NavDropdown.Item>
              <NavDropdown.Item onClick={handleSelectedArtist} className={selectedArtist === 'Jenn' && "active"} data-value="Jenn">Jenn</NavDropdown.Item>
              <NavDropdown.Item onClick={handleSelectedArtist} className={selectedArtist === 'Kevin' && "active"} data-value="Kevin">Kevin</NavDropdown.Item>
            </NavDropdown>
          </Nav>
          <Nav>
            <NavLink
              className={window.location.pathname.toLowerCase().indexOf('/settings') > -1 ? "nav-link active" : "nav-link"}
              to={"/settings"}>
              Settings
            </NavLink>
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

import React, {useEffect, useState} from "react";
import './Header.scss';
import logo from '../../../../images/header-logo-white.svg';
import user from '../../../../images/user.svg';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav'
import NavDropdown from 'react-bootstrap/NavDropdown'
import {NavLink, useHistory} from "react-router-dom";
import {ArtistContext} from "../../../../Store/artistContext";
import fetchAgreements from "../../../../common/utlis/fetchAgreements";
import fetchArtist from "../../../../common/utlis/fetchArtist";

function Header() {
  const history = useHistory();
  const [isLoading, setIsLoading] = useState(false);
  const {artistState, artistActions} = React.useContext(ArtistContext);
  const [selectedArtist, setSelectedArtist] = useState(null);

  useEffect(() => {
    initializeAgreements();
    initializeArtist();
  }, [])

  const initializeArtist = async () => {
    setIsLoading(true);
    const artist = await fetchArtist();
    artistActions.artistStateChanged(artist);
    setIsLoading(false);
  }

  const initializeAgreements = async () => {
    setIsLoading(true);
    const agreements = await fetchAgreements();
    artistActions.agreementsStateChanged(agreements);
    if(agreements.filter(agreement => agreement.status === "pending").length) {
      history.push("/accept-invitation");
    }
    setIsLoading(false);
  }

  const handleSelectedArtist = (e) => {
    artistActions.selectedArtistStateChanged(e.target.dataset.value);
    setSelectedArtist(e.target.dataset.value);
  }

  return (
    <>
    <header>
      <Navbar collapseOnSelect expand="lg" variant="dark" className="custom-nav">
        <NavLink to={"/"}><Navbar.Brand><img src={logo} alt="COMPANY LOGO"  className="" /></Navbar.Brand></NavLink>
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
            <Nav.Link href="mailto:info@audiosocket.com">
              Help
            </Nav.Link>
            <Nav.Link onClick={() => {
                localStorage.removeItem("user");
                history.push("/login");
              }}>
              Sign out
            </Nav.Link>
            <NavLink to={"/profile"} className="nav-link profile-pic">
              <img src={artistState.artist ? artistState.artist.cover_image ? artistState.artist.cover_image : user : user} alt="Profile Picture"  className="" />
            </NavLink>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    </header>
    </>
  );
}

export default Header;

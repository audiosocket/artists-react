import React, {useEffect, useState} from "react";
import './Header.scss';
import logo from '../../../../images/header-logo-white.svg';
import user from '../../../../images/user.svg';
import hamburger from '../../../../images/hamburger.svg';
import close from '../../../../images/close.svg';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav'
import NavDropdown from 'react-bootstrap/NavDropdown'
import {NavLink, useHistory} from "react-router-dom";
import {ArtistContext} from "../../../../Store/artistContext";
import fetchAgreements from "../../../../common/utlis/fetchAgreements";
import fetchArtist from "../../../../common/utlis/fetchArtist";
import fetchAlbums from "../../../../common/utlis/fetchAlbums";
import {ACCESS_TOKEN, AGREEMENTS, BASE_URL} from "../../../../common/api";
import csc from "country-state-city";
import fetchCollaborators from "../../../../common/utlis/fetchCollaborators";
import fetchPublishers from "../../../../common/utlis/fetchPublishers";

function Header({onToggleSidebar}) {
  const history = useHistory();
  const [isLoading, setIsLoading] = useState(false);
  const {artistState, artistActions} = React.useContext(ArtistContext);
  const [selectedArtist, setSelectedArtist] = useState(null);
  const [toggleSidebar, setToggleSidebar] = useState(true);

  useEffect(() => {
    initializeAgreements();
    initializeArtist();
    initializeAlbums();
    initializeCountriesList();
    initializePartners();
  }, [])

  const initializeAgreements = async () => {
    setIsLoading(true);
    const agreements = await fetchAgreements();
    if(!agreements.length) { // check if signature has expired
      const userAuthToken = JSON.parse(localStorage.getItem("user") ?? "");
      const response = await fetch(`${BASE_URL}${AGREEMENTS}`,
        {
          headers: {
            "authorization": ACCESS_TOKEN,
            "auth-token": userAuthToken
          }
        });
      if(!response.ok) {
        const resultSet = await response.json();
        if (resultSet.message.toLowerCase() === 'signature has expired') {
          alert('Session expired, login again to access!');
          localStorage.removeItem("user");
          history.push('/login');
          return
        }
      }
    }
    artistActions.agreementsStateChanged(agreements);
    if(agreements.length === agreements.filter(agreement => agreement.status === "rejected").length) {
      localStorage.removeItem("user");
      alert("Sorry, you can't proceed without accepting agreements.\nContact at artists@audiosocket.com for more details.");
      history.push("/login");
    }
    if(agreements.filter(agreement => agreement.status === "pending").length) {
      history.push("/accept-invitation");
    }
    setIsLoading(false);
  }

  const initializeArtist = async () => {
    setIsLoading(true);
    const artist = await fetchArtist();
    artistActions.artistStateChanged(artist);
    setIsLoading(false);
  }

  const initializeAlbums = async () => {
    setIsLoading(true);
    const albums = await fetchAlbums();
    artistActions.albumsStateChanged(albums);
    setIsLoading(false);
  }

  const initializeCountriesList = () => {
    const countries = csc.getAllCountries();
    const list = [];
    list.push({label: "Select Country", value: null, key: null});
    countries.forEach((country, key) => {
      list.push({label: country.name, value: country.name, countryCode: country.isoCode})
    });
    artistActions.countriesStateChanged(list);
  }

  const initializePartners = async () => {
    setIsLoading(true);
    const collaborators = await fetchCollaborators();
    artistActions.collaboratorsStateChanged(collaborators);
    const publishers = await fetchPublishers();
    artistActions.publishersStateChanged(publishers);
    setIsLoading(false);
  }

  const handleSelectedArtist = (e) => {
    artistActions.selectedArtistStateChanged(e.target.dataset.value);
    setSelectedArtist(e.target.dataset.value);
  }

  const handleToggle = () => {
    setToggleSidebar(!toggleSidebar);
    onToggleSidebar(!toggleSidebar);
  }

  return (
    <>
    <header>
      <Navbar collapseOnSelect expand="lg" variant="dark" className="custom-nav">
        <div className="not-for-desktop">
          <img onClick={handleToggle} src={toggleSidebar ? hamburger : close} alt="Sidebar Launcher"  className="" />
        </div>
        <NavLink className="logo-brand" to={"/"}><Navbar.Brand><img src={logo} alt="COMPANY LOGO"  className="" /></Navbar.Brand></NavLink>
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

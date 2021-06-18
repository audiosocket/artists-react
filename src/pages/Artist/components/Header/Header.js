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
import {ACCESS_TOKEN, AGREEMENTS, BASE_URL, LIST_ARTISTS} from "../../../../common/api";
import csc from "country-state-city";
import fetchCollaborators from "../../../../common/utlis/fetchCollaborators";
import fetchPublishers from "../../../../common/utlis/fetchPublishers";
import profile from '../../../../images/as-profile.svg';
import help from '../../../../images/as-help.svg';
import signout from '../../../../images/as-signout.svg';
import artist from '../../../../images/as-artist.svg';
import fetchArtistsList from "../../../../common/utlis/fetchArtistsList";
import Notiflix from "notiflix-react";

function Header({onToggleSidebar, onChangeIsActiveProfile, onChangeIsProfileCompleted}) {
  const history = useHistory();
  const [isLoading, setIsLoading] = useState(false);
  const {artistState, artistActions} = React.useContext(ArtistContext);
  const [selectedArtist, setSelectedArtist] = useState(null);
  const [toggleSidebar, setToggleSidebar] = useState(true);
  const [userRole, setUserRole] = useState(null);
  const [artistsList, setArtistsList] = useState([]);

  useEffect(() => {
    const userRole = JSON.parse(localStorage.getItem("userRole") ?? "");
    initializeUserRole(userRole);
    initializeAgreements(userRole);
    if(userRole === 'collaborator') {
      listArtists();
    }
    initializeCountriesList();
    initializeArtist();
    initializeAlbums();
    initializePartners();
  }, [])

  useEffect(() => {
    if(selectedArtist) {
      initializeArtist(selectedArtist.id);
      initializeAlbums(selectedArtist.id);
      initializePartners(selectedArtist.id);
    }
  }, [selectedArtist])

  useEffect(() => {
    if(artistState.artistsList)
      setArtistsList(artistState.artistsList);
  }, [artistState.artistsList])

  const initializeUserRole = (userRole) => {
    if(artistState.userRole)
      return;

    if(userRole) {
      setUserRole(userRole);
      artistActions.userRoleStateChanged(userRole);
    }
  }

  const initializeAgreements = async (userRole) => {
    setIsLoading(true);
    setUserRole(userRole);
    const agreements = await fetchAgreements(userRole ?? 'artist');
    if(!agreements.length) { // check if signature has expired
      const userAuthToken = JSON.parse(localStorage.getItem("user") ?? "");
      const response = await fetch(`${BASE_URL}${AGREEMENTS}?role=${userRole}`,
        {
          headers: {
            "authorization": ACCESS_TOKEN,
            "auth-token": userAuthToken
          }
        });
      if(!response.ok) {
        const resultSet = await response.json();
        if (resultSet.message.toLowerCase() === 'signature has expired') {
          Notiflix.Report.Failure( 'Session expired', `Your session is timed out, please login again to continue.`, 'Login', () => {
            localStorage.removeItem("user");
            localStorage.removeItem("userRole");
            history.push('/login');
          } );
          return
        }
      }
    }
    artistActions.agreementsStateChanged(agreements);
    if(agreements.length === agreements.filter(agreement => agreement.status === "rejected").length) {
      artistActions.isActiveProfileStateChanged(false);
      onChangeIsActiveProfile(false);
    } else {
      artistActions.isActiveProfileStateChanged(true);
      onChangeIsActiveProfile(true);
    }
    if(agreements.filter(agreement => agreement.status === "pending").length) {
      history.push("/accept-invitation");
    }
    setIsLoading(false);
  }

  const listArtists = async () => {
    setIsLoading(true);
    const artistsList = await fetchArtistsList();
    artistActions.artistsListStateChanged(artistsList);
    setArtistsList(artistsList);
    if(artistsList.length > 0) {
      const acceptedArtists = artistsList.filter(artist => artist.status === "accepted");
      if(acceptedArtists.length > 0) {
        setSelectedArtist(acceptedArtists[0]);
        artistActions.selectedArtistStateChanged(acceptedArtists[0]);
      }
    }
    setIsLoading(false);
  }

  const initializeArtist = async (artist_id = null) => {
    setIsLoading(true);
    const artist = await fetchArtist(artist_id);
    if(artist.message) {
      if (artist.message.toLowerCase() === 'signature has expired') {
        Notiflix.Report.Failure( 'Session expired', `Your session is timed out, please login again to continue.`, 'Login', () => {
          localStorage.removeItem("user");
          localStorage.removeItem("userRole");
          history.push('/login');
        } );
        return;
      }
    }
    artistActions.artistStateChanged(artist);
    if(artist) {
      if(!artist.contact_information || !artist.payment_information || !artist.tax_information) {
        artistActions.isProfileCompletedStateChanged(false);
        onChangeIsProfileCompleted(false);
      } else {
        artistActions.isProfileCompletedStateChanged(true);
        onChangeIsProfileCompleted(true);
      }
    }
    setIsLoading(false);
  }

  const initializeAlbums = async (artist_id = null) => {
    setIsLoading(true);
    const albums = await fetchAlbums(artist_id);
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

  const initializePartners = async (artist_id = null) => {
    setIsLoading(true);
    const collaborators = await fetchCollaborators(artist_id);
    artistActions.collaboratorsStateChanged(collaborators);
    const publishers = await fetchPublishers(artist_id);
    artistActions.publishersStateChanged(publishers);
    setIsLoading(false);
  }

  const handleSelectedArtist = (e) => {
    const artistId = parseInt(e.target.dataset.id);
    let selectedArtist = artistsList.filter((artist) => artist.id === artistId)
    selectedArtist = selectedArtist.length > 0 ? selectedArtist[0] : null;

    if(!selectedArtist)
      return false;

    if(selectedArtist.status === "accepted") {
      artistActions.selectedArtistStateChanged(selectedArtist);
      setSelectedArtist(selectedArtist);
    } else {
      Notiflix.Report.Warning( 'Not authorized', `You can't access ${selectedArtist.first_name}${selectedArtist.last_name ? ' '+selectedArtist.last_name : ''}'s portal without accepting their invite!`, 'Go to invites', () => {
        history.push('/invites');
      } );
      return false;
    }
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
        <Navbar.Text>{selectedArtist && selectedArtist.first_name+" "+selectedArtist.last_name+"'s Portal"}</Navbar.Text>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="mr-auto desktop-view">
            {artistsList.length !== 0 &&
              <NavDropdown title={"Choose artist"} id="collasible-nav-dropdown" className="artist-dropdown">
                {artistsList.map((artist, key) => {
                  return (
                    <NavDropdown.Item key={key} onClick={handleSelectedArtist} data-id={artist.id} className={selectedArtist ? selectedArtist.id === artist.id && "active" : ""}>{artist.first_name + ' ' + artist.last_name}</NavDropdown.Item>
                    );
                  })
                }
              </NavDropdown>
            }
          </Nav>
          <Nav>
            {artistsList.length !== 0 &&
              <NavDropdown className="mobile-view" title={<img src={artist} alt="Help"/>} id="collasible-nav-dropdown" className="mobile-view choose-artist-mobile">
                {artistsList.map((artist, key) => {
                  return (
                    <NavDropdown.Item key={key} onClick={handleSelectedArtist} data-id={artist.id}
                                      className={selectedArtist ? selectedArtist.id === artist.id && "active" : ""}>{artist.first_name + ' ' + artist.last_name}</NavDropdown.Item>
                  );
                })
                }
              </NavDropdown>
            }
            <Nav.Link href="mailto:info@audiosocket.com">
              <span className="desktop-view">Help</span>
              <img src={help} alt="Help"  className="mobile-view" />
            </Nav.Link>
            <Nav.Link onClick={() => {
                localStorage.removeItem("user");
                localStorage.removeItem("userRole");
                history.push("/login");
              }}>
              <span className="desktop-view">Sign out</span>
              <img src={signout} alt="Signout"  className="mobile-view" />
            </Nav.Link>
            <NavLink to={"/profile"} className="nav-link profile-pic">
              <img src={artistState.artist ? artistState.artist.cover_image ? artistState.artist.cover_image : user : user} alt="Profile Picture"  className="desktop-view" />
              <img src={profile} alt="Profile"  className="mobile-view profile-img" />
            </NavLink>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    </header>
    </>
  );
}

export default Header;

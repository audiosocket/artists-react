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
import {ACCESS_TOKEN, AGREEMENTS, ARTISTS_COLLABORATORS, BASE_URL} from "../../../../common/api";
import csc from "country-state-city";
import fetchCollaborators from "../../../../common/utlis/fetchCollaborators";
import fetchPublishers from "../../../../common/utlis/fetchPublishers";
import profile from '../../../../images/as-profile.svg';
import help from '../../../../images/as-help.svg';
import signout from '../../../../images/as-signout.svg';
import artist from '../../../../images/as-artist.svg';
import fetchArtistsList from "../../../../common/utlis/fetchArtistsList";
import Notiflix from "notiflix";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";

function Header({onToggleSidebar, onChangeIsActiveProfile, onChangeIsProfileCompleted}) {
  const history = useHistory();
  const [isLoading, setIsLoading] = useState(false);
  const {artistState, artistActions} = React.useContext(ArtistContext);
  const [selectedArtist, setSelectedArtist] = useState(null);
  const [toggleSidebar, setToggleSidebar] = useState(true);
  const [userRole, setUserRole] = useState(null);
  const [artistsList, setArtistsList] = useState([]);
  const [showChooseArtistModal, setShowChooseArtistModal] = useState(false);

  useEffect(() => {
    const userRole = JSON.parse(localStorage.getItem("userRole") ?? "");
    initializeUserRole(userRole);
    initializeAgreements(userRole);
    initializeCountriesList();
    if(userRole === 'collaborator') {
      listArtists();
    }
    if(!artistState.selectedArtist) {
      initializeArtist();
      initializeAlbums();
      initializePartners();
    }
  }, [])

  useEffect(() => {
    if(artistState.selectedArtist && artistState.selectedArtist.status === 'accepted') {
      initializeArtist(selectedArtist.id);
      initializeAlbums(selectedArtist.id);
      initializePartners(selectedArtist.id);
    }
    if(artistState.selectedArtist && artistState.selectedArtist.status !== 'accepted') {
      setShowChooseArtistModal(true);
      if(artistState.selectedArtist)
        setSelectedArtist(artistState.selectedArtist)
      if(artistState.artistsList)
        setArtistsList(artistState.artistsList);
    }
    if(userRole === 'collaborator' && !artistState.selectedArtist)
      setShowChooseArtistModal(true);
  }, [artistState.selectedArtist])

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
          Notiflix.Report.failure( 'Session expired', `Your session is timed out, please login again to continue.`, 'Login', () => {
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
      setShowChooseArtistModal(true);
    }
    setIsLoading(false);
  }

  const initializeArtist = async (artist_id = null) => {
    setIsLoading(true);
    const artist = await fetchArtist(artist_id);
    if(artist && artist.message) {
      if (artist.message.toLowerCase() === 'signature has expired') {
        Notiflix.Report.failure( 'Session expired', `Your session is timed out, please login again to continue.`, 'Login', () => {
          localStorage.removeItem("user");
          localStorage.removeItem("userRole");
          history.push('/login');
        } );
        return;
      }
    }
    artistActions.artistStateChanged(artist);
    if(artist) {
      if(!artist.banner_image || !artist.profile_image || !artist.contact_information) {
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

  const handleSelectedArtist = (e, statusCheck = true) => {
    const artistId = parseInt(e.target.dataset.id);
    let selectedArtist = artistsList.filter((artist) => artist.id === artistId)
    selectedArtist = selectedArtist.length > 0 ? selectedArtist[0] : null;

    if(!selectedArtist)
      return false;

    if(!statusCheck) {
      artistActions.selectedArtistStateChanged(selectedArtist);
      setSelectedArtist(selectedArtist);
      return true;
    }

    if(selectedArtist.status === "accepted") {
      artistActions.selectedArtistStateChanged(selectedArtist);
      setSelectedArtist(selectedArtist);
    } else {
      Notiflix.Report.warning( 'Not authorized', `You can't access ${selectedArtist.name}'s portal without accepting their invite!`, 'Go to invites', () => {
        history.push('/invites');
      } );
      return false;
    }
  }

  const handleToggle = () => {
    setToggleSidebar(!toggleSidebar);
    onToggleSidebar(!toggleSidebar);
  }

  const handleClose = () => {
    setShowChooseArtistModal(!showChooseArtistModal);
  }

  const handleChooseArtist = () => {
    if(!selectedArtist) {
      Notiflix.Report.warning('No artist selected', 'Please choose artist first before confirming!', 'Ok');
    } else {
      if(selectedArtist.status !== 'accepted') {
        Notiflix.Report.failure('Not authorized', `You can't access ${selectedArtist.name}'s portal without accepting their invite!. You may choose another artist (if any).`, 'Ok');
      } else
        handleClose();
    }
  }

  const handleInviteAction = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const status = e.target.dataset.action;
    const data = new FormData();
    data.append('status', status);
    const userAuthToken = JSON.parse(localStorage.getItem("user") ?? "");
    const response = await fetch(`${BASE_URL}${ARTISTS_COLLABORATORS}/${selectedArtist.id}/update_status`,
      {
        headers: {
          "authorization": ACCESS_TOKEN,
          "auth-token": userAuthToken
        },
        method: 'PATCH',
        body: data
      });
    if(!response.ok) {
      Notiflix.Notify.failure('Something went wrong, try later!', {
        timeout: 6000,
      });
    } else {
      const artistsList = await fetchArtistsList();
      artistActions.artistsListStateChanged(artistsList);
      setArtistsList(artistsList);
      const tmpSelected = artistsList.filter((artist) => artist.id === selectedArtist.id);
      setSelectedArtist(tmpSelected[0] || null);
      artistActions.selectedArtistStateChanged(tmpSelected[0] || null)
      Notiflix.Notify.success('Your invite status updated successfully!');
    }
    setIsLoading(false);
  }

  return (
    <>
    <header className="fixed-top">
      <Navbar collapseOnSelect expand="lg" variant="dark" className="custom-nav">
        <div className="not-for-desktop">
          <img onClick={handleToggle} src={toggleSidebar ? hamburger : close} alt="Sidebar Launcher"  className="" />
        </div>
        <NavLink className="logo-brand" to={"/"}><Navbar.Brand><img src={logo} alt="COMPANY LOGO"  className="" /></Navbar.Brand></NavLink>
        <Navbar.Text>{selectedArtist && selectedArtist.name+"'s Portal"}</Navbar.Text>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="mr-auto desktop-view">
            {artistsList.length !== 0 &&
              <NavDropdown title={"Choose artist"} id="collasible-nav-dropdown" className="artist-dropdown">
                {artistsList.map((artist, key) => {
                  return (
                    <NavDropdown.Item key={key} onClick={handleSelectedArtist} data-id={artist.id} className={selectedArtist ? selectedArtist.id === artist.id && "active" : ""}>{artist.name}</NavDropdown.Item>
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
                    <NavDropdown.Item key={key} onClick={handleSelectedArtist} data-id={artist.id} className={selectedArtist ? selectedArtist.id === artist.id && "active" : ""}>{artist.name}</NavDropdown.Item>
                  );
                })
                }
              </NavDropdown>
            }
            <Nav.Link href="mailto:artists@audiosocket.com">
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
              <img src={artistState.artist ? artistState.artist.profile_image ? artistState.artist.profile_image : user : user} alt="Profile Picture"  className="desktop-view" />
              <img src={profile} alt="Profile"  className="mobile-view profile-img" />
            </NavLink>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    </header>
    <Modal
      show={showChooseArtistModal}
      onHide={handleClose}
      size="sm"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      className="customArtistModal choose-artist-modal"
      backdrop="static"
      keyboard={false}
    >
      <Form noValidate>
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Choose Artist
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="choose-artist-modal-container">
            <div className="section form-group">
              <label>Select an artist from your invites</label>
              {artistsList.length !== 0 &&
              <NavDropdown title={selectedArtist ? selectedArtist.name : "Choose artist"} id="collasible-nav-dropdown" className="form-control choose-artist-select">
                {
                  artistsList.map((artist, key) => {
                    return (
                      <NavDropdown.Item key={key} onClick={(e) => handleSelectedArtist(e, false)} data-id={artist.id} className={selectedArtist ? selectedArtist.id === artist.id && "active" : ""}>{artist.name}</NavDropdown.Item>
                    );
                  })
                }
              </NavDropdown>
              }
              {artistsList.length === 0 &&
                <p><i>No artist invite found!</i></p>
              }
            </div>
            {selectedArtist && selectedArtist.status !== "accepted" &&
              <>
              <p>Selected artist's invite status is <strong>{selectedArtist.status}</strong>, you must accept invite to proceed!</p>
              <div className="popup-btn-wrapper">
                <Button onClick={handleInviteAction} data-action={"rejected"} className="primary-btn rejected-btn" variant="btn primary-btn reject btn-full-width">
                  Reject
                </Button>
                <Button onClick={handleInviteAction} data-action={"accepted"} variant="btn primary-btn accept btn-full-width">
                  Accept
                </Button>
              </div>
              </>
            }
          </div>
        </Modal.Body>
        <Modal.Footer>
          {artistsList.length !== 0
            ? <Button onClick={(e) => handleChooseArtist(e)} className="btn primary-btn submit">{isLoading ? 'Processing...' : 'Confirm'}</Button>
            : <Button onClick={() => {localStorage.removeItem("user");localStorage.removeItem("userRole");history.push("/login")}} className="btn primary-btn submit">Sign out</Button>
          }
        </Modal.Footer>
      </Form>
    </Modal>
    </>
  );
}

export default Header;

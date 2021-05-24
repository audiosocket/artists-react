import React, {useEffect, useRef, useState} from "react";
import "./Music.scss";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import {ArtistContext} from "../../../../Store/artistContext";
import fetchAlbums from "../../../../common/utlis/fetchAlbums";
import Loader from "../../../../images/loader.svg";
import Edit from "../../../../images/pencil.svg";
import {ACCESS_TOKEN, ALBUMS, BASE_URL} from "../../../../common/api";
import Form from "react-bootstrap/Form";
import {NavLink} from "react-router-dom";
import Breadcrumb from 'react-bootstrap/Breadcrumb';

function AlbumsListing() {
  const {artistState, artistActions} = React.useContext(ArtistContext);
  const [isLoading, setIsLoading] = useState(false);
  const [albums, setAlbums] = useState([]);
  const [showCreateAlbumModal, setShowCreateAlbumModal] = useState(false);
  const form = useRef(null);
  const [validated, setValidated] = useState(false);

  useEffect(() => {
    if (!artistState.albums)
      getAlbums()
    else
      setAlbums(artistState.albums)
  }, [])

  const getAlbums = async () => {
    setIsLoading(true);
    const albums = await fetchAlbums();
    artistActions.albumsStateChanged(albums);
    setAlbums(albums);
    setIsLoading(false);
  }

  const handleCreateAlbum = async (e) => {
    e.preventDefault();
    const albumForm = e.currentTarget;
    if (albumForm.checkValidity() === false) {
      e.preventDefault();
      e.stopPropagation();
      setValidated(true);
    } else {
      setIsLoading(true);
      const data = new FormData(form.current);
      const userAuthToken = JSON.parse(localStorage.getItem("user") ?? "");
      const response = await fetch(`${BASE_URL}${ALBUMS}`,
        {
          headers: {
            "authorization": ACCESS_TOKEN,
            "auth-token": userAuthToken
          },
          method: 'POST',
          body: data
        });
      if (!response.ok) {
        alert('Something went wrong, try later!');
      } else {
        const albums = await fetchAlbums();
        setAlbums(albums);
        artistActions.albumsStateChanged(albums);
        handleClose();
        e.target.reset();
      }
      setIsLoading(false);
    }
  }

  const handleClose = () => {
    setShowCreateAlbumModal(false);
    setValidated(false);
    if(form.current) {
      form.current.reset()
    }
  }

  return (
    <div className="musicWrapper">
      <div className="asBreadcrumbs">
        <Breadcrumb>
          <Breadcrumb.Item active href="#">Albums Listing</Breadcrumb.Item>
          <Breadcrumb.Item href="https://getbootstrap.com/docs/4.0/components/breadcrumb/">
            Albums
          </Breadcrumb.Item>
          <Breadcrumb.Item>Track</Breadcrumb.Item>
        </Breadcrumb>
        </div>
      
      <h2>Music</h2>
      <div className="agreementBody">
        <section>
          <div className="bg-content yellow bgSecondVersion mt-4">
            <h4 className="mb-3"><strong>Uploading Music</strong></h4>
            <p>We can't be a music company without music! You can create new albums and upload tracks to your
              portal.</p>
            <p>Please choose your album titles wisely, as they will now appear in our partner Storefronts for licensing.
              Please do not include dates or other extensions in album titles. Ex: <i><strong>"My Amazing Tracks for
                Audiosocket 2012"</strong></i></p>
            <p className="mb-0">When uploading tracks, please view your track names. Tracks should be edited to include what you would
              like them displayed as Ex: <i><strong>"Track Name master WAV"</strong></i> should be edited to <i><strong>"Track
                Name"</strong></i>.</p>
          </div>
        </section>
        <section className="pt-4">
          <div className="section-head">
            <h2>Albums</h2>
            <a onClick={() => setShowCreateAlbumModal(true)} className="btn primary-btn">Create an album</a>
          </div>
          {isLoading && <h5>Loading albums... <img className="loading" src={Loader} alt="loading-icon"/></h5>}
          <div className="music-playlist">
            <ul className="music-row">
              {albums.length !== 0
                ? albums.map((album, key) => {
                  return (
                    <li key={key}>
                      <NavLink
                        to={`/music/album/${album.id}`}>{album.name} {album.release_date ? "(Release date: " + album.release_date.split(" ")[0] + ")" : ""}
                      </NavLink>
                      <img src={Edit} alt="edit-icon"/>
                    </li>
                  )
                })
                : <h5><i>No album created yet!</i></h5>
              }
            </ul>
          </div>
        </section>
      </div>
      {showCreateAlbumModal &&
      <Modal
        show={showCreateAlbumModal}
        onHide={handleClose}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        className="customArtistModal"
      >
        <Form noValidate validated={validated} ref={form} onSubmit={handleCreateAlbum}>
          <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title-vcenter">
              New album {artistState.artist ? "for " + artistState.artist.name : ""}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="create-album-modal-container">
              <div className="section">
                  <Row>
                    <Col xs={12}>
                      <div className="form-group">
                        <Form.Control
                          required
                          name="name"
                          type="text"
                          placeholder="Album Name*"
                        />
                        <Form.Control.Feedback type="invalid">
                          Album name is required!
                        </Form.Control.Feedback>
                      </div>
                    </Col>
                  </Row>
                  <Row>
                    <Col xs={12}>
                      <div className="form-group">
                        <Form.Control                          
                          type="text"
                          onFocus={(e) => (e.currentTarget.type = "date")}
                          onBlur={(e) => (e.currentTarget.type = "text")}
                          placeholder="Release Date"
                        />
                        <small className="text-muted">Release date is optional</small>
                      </div>
                    </Col>
                  </Row>
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button className="btn btn-outline-light" onClick={handleClose}>Cancel</Button>
            <Button type="submit" className="btn primary-btn submit">{isLoading ? <>Creating...<img src={Loader} alt="icon"/></>: "Create Album"}</Button>
          </Modal.Footer>
        </Form>
      </Modal>
      }
    </div>
  )
}

export default AlbumsListing;
import "./Music.scss";
import React, {useEffect, useRef, useState} from "react";
import {Breadcrumb} from 'react-bootstrap';
import {NavLink, useHistory} from "react-router-dom";
import Edit from "../../../../images/pencil.svg";
import {ArtistContext} from "../../../../Store/artistContext";
import fetchAlbums from "../../../../common/utlis/fetchAlbums";
import Loader from "../../../../images/loader.svg";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import {ACCESS_TOKEN, ALBUMS, BASE_URL} from "../../../../common/api";
import Select from "react-select";
import cover from "../../../../images/artist-cover.jpg";


function Album({id = null}) {
  const {artistState, artistActions} = React.useContext(ArtistContext);
  const [isLoading, setIsLoading] = useState(false);
  const form = useRef(false);
  const [validated, setValidated] = useState(false);
  const [album, setAlbum] = useState(null);
  const [selectedTrack, setSelectedTrack] = useState(null);
  const [showAddMusicModal, setShowAddMusicModal] = useState(false);
  const [isPublicDomain, setIsPublicDomain] = useState(false);
  const [file, setFile] = useState(null);
  const [inValidFile, setInvalidFile] = useState(false);
  const history = useHistory();
  const collaboratorRef = useRef(false);
  const publisherRef = useRef(false);
  const [collaboratorsDropdown, setCollaboratorsDropdown] = useState([]);
  const [publishersDropdown, setPublishersDropdown] = useState([]);
  const [collaborator, setCollaborator] = useState(null);
  const [publisher, setPublisher] = useState(null);

  useEffect(() => {
    if(artistState.albums) {
      const filteredAlbum = artistState.albums.filter(album => parseInt(album.id) === parseInt(id));
      setAlbum(filteredAlbum[0] ?? null)
      preparePartnersDropdown()
    } else {
      getAlbum();
    }
  }, [])

  const getAlbum = async () => {
    setIsLoading(true);
    const albums = await fetchAlbums();
    artistActions.albumsStateChanged(albums);
    const filteredAlbum = albums.filter(album => parseInt(album.id) === parseInt(id));
    setAlbum(filteredAlbum[0] ?? null)
    setIsLoading(false);
  }

  const preparePartnersDropdown = () => {
    const tmp = [];
    if(artistState.collaborators) {
      tmp.push({label: "Select collaborator", value: null})
      for (let i = 0; i < artistState.collaborators.length; i++) {
        tmp.push({label: artistState.collaborators[i].name, value: artistState.collaborators[i].id});
      }
      setCollaboratorsDropdown(tmp);
    }
    if(artistState.publishers) {
      tmp.push({label: "Select publisher", value: null})
      for (let i = 0; i < artistState.publishers.length; i++) {
        tmp.push({label: artistState.publishers[i].name, value: artistState.publishers[i].id});
      }
      setPublishersDropdown(tmp);
    }
  }

  const handleSubmitAddMusic = async (e) => {
    e.preventDefault();
    const musicForm = e.currentTarget;
    if (musicForm.checkValidity() === false) {
      e.preventDefault();
      e.stopPropagation();
      setValidated(true);
    } else {
      const data = new FormData(form.current);
      if(file) {
        if(!handleChangeMusicUpload(data.get("file").name)) {
          return;
        }
      } else {
        data.delete('file');
      }
      setIsLoading(true);
      if(data.get("public_domain"))
        data.set("public_domain", true);
      else
        data.set("public_domain", false);
      const userAuthToken = JSON.parse(localStorage.getItem("user") ?? "");
      const URL = selectedTrack ? `${BASE_URL}${ALBUMS}/${id}/tracks/${selectedTrack.id}` : `${BASE_URL}${ALBUMS}/${id}/tracks`;
      const response = await fetch(`${URL}`,
        {
          headers: {
            "authorization": ACCESS_TOKEN,
            "auth-token": userAuthToken
          },
          method: selectedTrack ? "PATCH" : "POST",
          body: data
        });
      if (!response.ok) {
        alert('Something went wrong, try later!');
      } else {
        const albums = await fetchAlbums();
        artistActions.albumsStateChanged(albums);
        const filteredAlbum = albums.filter(album => parseInt(album.id) === parseInt(id));
        setAlbum(filteredAlbum[0] ?? null)
        handleClose();
        e.target.reset();
      }
      setIsLoading(false);
    }
  }

  const handleAlbumDelete = async (e) => {
    e.preventDefault();
    if(window.confirm(`Are you sure to delete "${album.name}"?`)) {
      setIsLoading(true);
      const userAuthToken = JSON.parse(localStorage.getItem("user") ?? "");
      const response = await fetch(`${BASE_URL}${ALBUMS}/${id}`,
        {
          headers: {
            "authorization": ACCESS_TOKEN,
            "auth-token": userAuthToken
          },
          method: "DELETE"
        });
      if (!response.ok) {
        alert('Something went wrong, try later!');
        setIsLoading(false);
      } else {
        const albums = await fetchAlbums();
        artistActions.albumsStateChanged(albums);
        setIsLoading(false);
        history.push(`/music`);
      }
    }
  }

  const handleAddMusicModal = () => {
    setShowAddMusicModal(true);
  }

  const handleEditMusicModal = (track) => {
    setSelectedTrack(track);
    setShowAddMusicModal(true);
    setIsPublicDomain(track.public_domain === true || track.public_domain === "true" ? true : false);
  }

  const handleClose = () => {
    setShowAddMusicModal(false);
    setSelectedTrack(null);
    setIsPublicDomain(false);
    setValidated(false);
    setFile(null);
    setInvalidFile(false);
  }

  const handleChangeMusicUpload = (file) => {
    var reg = /(.*?)\.(wav|aiff|aif)$/;
    if(!file.toLowerCase().match(reg)) {
      setInvalidFile(true)
      return false;
    } else {
      setInvalidFile(false);
      return true;
    }
  }

  const handleChangePublicDomain = (e) => {
    setIsPublicDomain(!isPublicDomain)
  }

  return (
    <div className="albumsWrapper">
      <div className="asBreadcrumbs">
        <Breadcrumb>
          <li className="breadcrumb-item">
            <NavLink to="/">Home</NavLink>
          </li>
          <li className="breadcrumb-item">
            <NavLink to="/music">Music</NavLink>
          </li>
          <li className="breadcrumb-item">
            <NavLink to="/music">Albums</NavLink>
          </li>
          <li className="breadcrumb-item active">
            {album ? album.name : ''}
          </li>
        </Breadcrumb>
      </div>
      {isLoading && !album && <h5>Loading album... <img className="loading" src={Loader} alt="loading-icon"/></h5>}
      <div className="section-content">
        <section >
          <div className="section-head">
            <h2>{album ? album.name : ''}</h2>
            <div className="sec-controls">
              <NavLink to={"/music/album/"+id+"/edit"} className="btn primary-btn mr-2">Edit</NavLink>
              <a onClick={handleAlbumDelete} className="close-btn btn delete">{isLoading ? <>Deleting...<img className="loading" src={Loader} alt="icon"/></> : "Delete" }</a>
            </div>
          </div>
          <div className="section-body">
            <div className="bg-content yellow bgSecondVersion">
              <p>Please make sure you edit your track metadata carefully, make sure it looks the way you'd like it to be seen in the player. Once you upload music and assign writers to the tracks, please remember to check the blue <strong>"Submit To Classification"</strong> button on each track and the music will become available to our team for review. If you forget this part, your music will not be available to us.</p>
              <p className="mb-0">Original material only please! We do not accept cover songs or songs containing samples. Unless it's public domain, you and your collaborators must own all the copyrights to the music you're submitting.</p>
            </div>
          </div>
        </section>

        <section className="pt-4">
          <div className="section-head">
            <h2>Artwork</h2>
            <NavLink to={"/music/album/"+id+"/artwork"} className="btn primary-btn">Edit</NavLink>
            {album && !album.artwork &&
              <p className="sec-head-para mb-0">Time to add some artwork to this album! Click the <i className="medium-text">Edit</i> button above to get started.</p>
            }
          </div>
          {album && album.artwork &&
            <div className="section-body">
              <div className="artwork-images-sec">
                <div className="artwork-image">
                  <a target="_blank" href={album.artwork}>
                    <img src={album.artwork} alt="Artwork"/>
                  </a>
                </div>
              </div>
            </div>
          }
        </section>

        <section className="pt-4">
          <div className="section-head">
            <h2>Tracks</h2>
            <a onClick={handleAddMusicModal} className="btn primary-btn mr-2">Add music</a>
          </div>
          <div className="section-body">
            <div className="track-wrapper">
              {album && album.tracks.length !== 0 &&
                <div className="trackrow head-row">
                  <div className="track-title">Title</div>
                  <div className="track-writter">Writers</div>
                  <div className="track-publisher">Publisher</div>
                  <div className="track-edit">Action</div>
                </div>
              }
              {album && album.tracks.length
                ?
                album.tracks.map((track, key) => {
                  return (
                    <div key={key} className="trackrow body-row">
                      <div className="track-title">
                        <div className="titleName">
                          <p>{track.title}</p>
                          <em>Uploaded {track.created_at.split(' ')[0]}</em>
                        </div>
                      </div>
                      <div className="track-writter">
                        Brittni stewart
                      </div>
                      <div className="track-publisher">Jetty Rae LLC</div>
                      <div className="track-edit">
                        <a onClick={(e) => handleEditMusicModal(track)}><img src={Edit} alt="Edit"/></a>
                      </div>
                    </div>
                  )
                })
                : <p>No music created yet! Click <i className="medium-text">Add Music</i> button above to get started.</p>
              }
            </div>
          </div>
        </section>
      </div>
      {showAddMusicModal &&
      <Modal
        show={showAddMusicModal}
        onHide={handleClose}
        aria-labelledby="contained-modal-title-vcenter"
        centered
        className="customArtistModal closeOn"
      >
        <Form noValidate validated={validated} ref={form} onSubmit={handleSubmitAddMusic}>
          <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title-vcenter">
              {selectedTrack
                ? `Edit music ${artistState.artist ? "to " + album.name : ""}`
                : `Add music ${artistState.artist ? "to " + album.name : ""}`
              }
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="modal-container music-modal-container">
              <div className="section">
                <Row>
                  <Col xs={12}>
                    <div className="form-group">
                      <Form.File
                        name="file"
                        type="file"
                        className={inValidFile && "invalid"}
                        label={file ? file.name : selectedTrack ? selectedTrack.file.split("/")[selectedTrack.file.split("/").length-1] : "Select file (WAV or AIFF)*"}
                        data-browse="Select music"
                        onChange={(e) => { if(e.target.files[0]) {setFile(e.target.files[0]); handleChangeMusicUpload(e.target.value)}}}
                        custom
                      />
                      {inValidFile && <small className="error">Valid WAV or AIFF file is required!</small> }
                    </div>
                  </Col>
                </Row>
                <Row>
                  <Col xs={12}>
                    <div className="form-group">
                      <Form.Control
                        required
                        name="title"
                        type="text"
                        defaultValue={selectedTrack ? selectedTrack.title : ''}
                        placeholder="Title*"
                      />
                    </div>
                  </Col>
                </Row>
                <Row>
                  <Col xs={12}>
                    <div className="form-group">
                      <Select
                        ref={collaboratorRef}
                        isSearchable={false}
                        placeholder="Select collaborator"
                        className="collaborator-select-container-header"
                        classNamePrefix="collaborator-select-header react-select-popup"
                        options={collaboratorsDropdown}
                        defaultValue={{label: "Select collaborator", value: null}}
                        onChange={(target) => setCollaborator(target.value)}
                        theme={theme => ({
                          ...theme,
                          colors: {
                            ...theme.colors,
                            primary: '#c0d72d',
                          },
                        })}
                      />
                    </div>
                  </Col>
                </Row>
                <Row>
                  <Col xs={12}>
                    <div className="form-group">
                      <Select
                        ref={publisherRef}
                        isSearchable={false}
                        placeholder="Select publisher"
                        className="publisher-select-container-header"
                        classNamePrefix="publisher-select-header react-select-popup"
                        options={publishersDropdown}
                        defaultValue={{label: "Select publisher", value: null}}
                        onChange={(target) => setPublisher(target.value)}
                        theme={theme => ({
                          ...theme,
                          colors: {
                            ...theme.colors,
                            primary: '#c0d72d',
                          },
                        })}
                      />
                    </div>
                  </Col>
                </Row>
                <Row>
                  <Col xs={12}>
                  <label htmlFor="public_domain" className="checkbox">
                    <input
                      name="public_domain"
                      id="public_domain"
                      type="checkbox"
                      onClick={handleChangePublicDomain}
                      value={isPublicDomain}
                      checked={isPublicDomain}
                    />
                      Public Domain
                      <span className={isPublicDomain ? "checkmark checked" : "checkmark"}></span>
                  </label>
                  </Col>
                </Row>
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            {!selectedTrack
              ? <Button type="submit" className="btn primary-btn submit">{isLoading ? <>Adding...<img src={Loader} alt="icon"/></> : "Add Music"}</Button>
              : <Button type="submit" className="btn primary-btn submit">{isLoading ? <>Saving...<img src={Loader} alt="icon"/></> : "Save"}</Button>
            }
            <Button className="as-tertiary-modal-btn" onClick={handleClose}>Submit for Classification</Button>
          </Modal.Footer>
        </Form>
      </Modal>
      }
    </div>
  )
}

export default Album;
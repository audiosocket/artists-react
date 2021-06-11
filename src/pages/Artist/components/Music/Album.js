import "./Music.scss";
import React, {useEffect, useRef, useState} from "react";
import {Breadcrumb} from 'react-bootstrap';
import {NavLink, useHistory} from "react-router-dom";
import Edit from "../../../../images/pencil.svg";
import EditDisable from "../../../../images/pencil-slash.png";
import Delete from "../../../../images/delete.svg";
import DeleteDisable from "../../../../images/delete-slash.png";
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
import fetchCollaborators from "../../../../common/utlis/fetchCollaborators";
import fetchPublishers from "../../../../common/utlis/fetchPublishers";


function Album({id = null}) {
  const {artistState, artistActions} = React.useContext(ArtistContext);
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
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
    } else {
      getAlbum();
    }
    preparePartnersDropdown()
  }, [])

  const getAlbum = async () => {
    setIsLoading(true);
    const albums = await fetchAlbums();
    artistActions.albumsStateChanged(albums);
    const filteredAlbum = albums.filter(album => parseInt(album.id) === parseInt(id));
    setAlbum(filteredAlbum[0] ?? null)
    setIsLoading(false);
  }

  const preparePartnersDropdown = async () => {
    const collaborators = artistState.collaborators ?? await fetchCollaborators();
    if(!artistState.collaborators)
      artistActions.collaboratorsStateChanged(collaborators ?? null);

    const publishers = artistState.publishers ?? await fetchPublishers();
    if(!artistState.publishers)
      artistActions.publishersStateChanged(publishers ?? null);

    if(collaborators) {
      let tmp = [];
      tmp.push({label: "Select writer/collaborator", value: null})
      for (let i = 0; i < collaborators.length; i++) {
        if(collaborators[i].first_name)
          tmp.push({label: collaborators[i].first_name +' '+ collaborators[i].last_name ?? '', value: collaborators[i].id});
      }
      setCollaboratorsDropdown(tmp);
    }
    if(publishers) {
      let tmp = [];
      tmp.push({label: "Select publisher", value: null})
      for (let i = 0; i < publishers.length; i++) {
        if(publishers[i].name)
          tmp.push({label: publishers[i].name, value: publishers[i].id});
      }
      setPublishersDropdown(tmp);
    }
  }

  const handleSubmitMusic = async (e) => {
    e.preventDefault();
    const musicForm = e.currentTarget;
    if (musicForm.checkValidity() === false) {
      e.preventDefault();
      e.stopPropagation();
      setValidated(true);
      setIsSubmitting(false);
    } else {
      const data = new FormData(form.current);
      if(file) {
        if(!handleChangeMusicUpload(data.get("file").name)) {
          setIsSubmitting(false);
          return false;
        }
      } else {
        data.delete('file');
      }
      if(collaborator)
        data.append('collaborator_id', collaborator)
      if(publisher)
        data.append('publisher_id', publisher)

      if(data.get("public_domain"))
        data.set("public_domain", true);
      else
        data.set("public_domain", false);

      if(isSubmitting) {
        if(window.confirm(`Are you sure to submit "${data.get('title')}" for classification?`)) {
          data.append('status', 'unclassified');
        } else {
          setIsSubmitting(false);
          return false;
        }
      } else {
        setIsLoading(true);
      }

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
      setIsSubmitting(false);
      setIsLoading(false);
    }
  }

  const handleAlbumDelete = async (e) => {
    e.preventDefault();
    if(window.confirm(`Are you sure to delete "${album.name}"?`)) {
      setIsDeleting(true);
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
        setIsDeleting(false);
      } else {
        const albums = await fetchAlbums();
        artistActions.albumsStateChanged(albums);
        setIsDeleting(false);
        history.push(`/music`);
      }
    }
  }

  const handleDeleteMusic = async (track) => {
    if(window.confirm(`Are you sure to delete "${track.title}"?`)) {
      const userAuthToken = JSON.parse(localStorage.getItem("user") ?? "");
      const response = await fetch(`${BASE_URL}${ALBUMS}/${id}/tracks/${track.id}`,
        {
          headers: {
            "authorization": ACCESS_TOKEN,
            "auth-token": userAuthToken
          },
          method: "DELETE"
        });
      if (!response.ok) {
        alert('Something went wrong, try later!');
      } else {
        const albums = await fetchAlbums();
        artistActions.albumsStateChanged(albums);
        const filteredAlbum = albums.filter(album => parseInt(album.id) === parseInt(id));
        setAlbum(filteredAlbum[0] ?? null)
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
    setCollaborator(null);
    setPublisher(null);
    setIsSubmitting(false);
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

  const handleClassification = () => {
    setIsSubmitting(true);
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
              <a onClick={handleAlbumDelete} className="close-btn btn delete">{isDeleting ? <>Deleting...<img className="loading" src={Loader} alt="icon"/></> : "Delete" }</a>
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
          {!album && isLoading && <h5>Loading artwork... <img className="loading" src={Loader} alt="loading-icon"/></h5>}
          {album && album.artwork &&
            <div className="section-body">
              <div className="artwork-images-sec">
                <div className="artwork-image">
                  <img src={album.artwork} alt="Artwork"/>
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
                  <div className="track-status">Status</div>
                  <div className="track-edit">Actions</div>
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
                          <em>Uploaded {track.created_at ? track.created_at.split(' ')[0] : ""}</em>
                        </div>
                      </div>
                      <div className="track-writter">{track.collaborator ? track.collaborator.first_name + ' '+ track.collaborator.last_name : "-"}</div>
                      <div className="track-publisher">{track.publisher ? track.publisher.name : "-"}</div>
                      <div className="track-status">{track.status ? track.status.toLowerCase() === "unclassified" ? "Submitted for classification" : track.status : ""}</div>
                      <div className="track-edit">
                        {track.status === "pending"
                          ?
                          <>
                            <a className="track-action" title="Edit track" onClick={(e) => handleEditMusicModal(track)}><img src={Edit} alt="Edit"/></a>
                            <a className="track-action" title="Delete track" onClick={(e) => handleDeleteMusic(track)}><img src={Delete} alt="Delete"/></a>
                          </>
                          :
                          <>
                            <a className="disabled" title="Track is under review, can't edit."><img src={EditDisable} alt="Edit"/></a>
                            <a className="disabled" title="Track is under review, can't delete."><img src={DeleteDisable} alt="Delete"/></a>
                          </>
                          }
                      </div>
                    </div>
                  )
                })
                : !album && isLoading ? <h5>Loading tracks... <img className="loading" src={Loader} alt="loading-icon"/></h5> : <p>No music created yet! Click <i className="medium-text">Add Music</i> button above to get started.</p>
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
        <Form noValidate validated={validated} ref={form} onSubmit={handleSubmitMusic}>
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
                        accept=".wav, .aiff"
                        name="file"
                        type="file"
                        required={!selectedTrack}
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
                        placeholder="Select writer/collaborator"
                        className="collaborator-select-container-header"
                        classNamePrefix="collaborator-select-header react-select-popup"
                        options={collaboratorsDropdown}
                        defaultValue={selectedTrack ? selectedTrack.collaborator ? collaboratorsDropdown.filter(item => parseInt(item.value) === parseInt(selectedTrack.collaborator.id)) : {label: "Select writer/collaborator", value: null} : {label: "Select writer/collaborator", value: null}}
                        onChange={(target) => setCollaborator(target.value)}
                        maxMenuHeight={120}
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
                        placeholder="Select publisher"
                        className="publisher-select-container-header"
                        classNamePrefix="publisher-select-header react-select-popup"
                        options={publishersDropdown}
                        defaultValue={selectedTrack ? selectedTrack.publisher ? publishersDropdown.filter(item => parseInt(item.value) === parseInt(selectedTrack.publisher.id)) : {label: "Select publisher", value: null} : {label: "Select publisher", value: null}}
                        onChange={(target) => setPublisher(target.value)}
                        maxMenuHeight={120}
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
                      onChange={handleChangePublicDomain}
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
            <Button type="submit" onClick={handleClassification} className="as-tertiary-modal-btn submit">{isSubmitting ? <>Submitting...<img src={Loader} alt="icon"/></> : "Submit for Classification"}</Button>
          </Modal.Footer>
        </Form>
      </Modal>
      }
    </div>
  )
}

export default Album;
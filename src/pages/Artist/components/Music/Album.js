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
import {ACCESS_TOKEN, ALBUMS, BASE_URL, COLLABORATOR_ALBUMS} from "../../../../common/api";
import Select from "react-select";
import fetchCollaborators from "../../../../common/utlis/fetchCollaborators";
import fetchPublishers from "../../../../common/utlis/fetchPublishers";
import OverlayTrigger from 'react-bootstrap/OverlayTrigger'
import Tooltip from 'react-bootstrap/Tooltip'
import Notiflix from "notiflix-react";
import Notes from "../../../../common/Notes/Notes";

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
  const [isExplicit, setIsExplicit] = useState(false);
  const [file, setFile] = useState(null);
  const [inValidFile, setInvalidFile] = useState(false);
  const history = useHistory();
  const collaboratorRef = useRef(false);
  const publisherRef = useRef(false);
  const [collaboratorsDropdown, setCollaboratorsDropdown] = useState([]);
  const [publishersDropdown, setPublishersDropdown] = useState([]);
  const [collaborator, setCollaborator] = useState(null);
  const [publisher, setPublisher] = useState(null);
  const [isDeletable, setIsDeletable] = useState(true);

  useEffect(() => {
    if(artistState.albums) {
      const filteredAlbum = artistState.albums.filter(album => parseInt(album.id) === parseInt(id));
      if(filteredAlbum.length > 0)
        setAlbum(filteredAlbum[0]);
      else {
        history.push('/music');
        Notiflix.Report.Failure( 'Invalid album', `Album doesn't exist`, 'Ok');
      }
      if(filteredAlbum.length > 0 && filteredAlbum[0].tracks.length) {
        const isDeletable = filteredAlbum[0].tracks.filter(track => (track.status === "unclassified" || track.status === "accepted"));
        if(isDeletable.length > 0) {
          setIsDeletable(false);
        }
      }
    }
    preparePartnersDropdown()
  }, [artistState.albums])

  const preparePartnersDropdown = async () => {
    const userRole = artistState.userRole || JSON.parse(localStorage.getItem("userRole") ?? "");
    let artist_id = null;
    if(userRole === "collaborator")
      artist_id = artistState.selectedArtist && artistState.selectedArtist.id;
    let collaborators = null;
    try {
      collaborators = artistState.collaborators ?? await fetchCollaborators(artist_id);
      if (!artistState.collaborators)
        artistActions.collaboratorsStateChanged(collaborators ?? null);
    } catch (error) {
      collaborators = null;
    }
    let publishers = null;
    try {
      publishers = artistState.publishers ?? await fetchPublishers(artist_id);
      if (!artistState.publishers)
        artistActions.publishersStateChanged(publishers ?? null);
    } catch (error) {
      publishers = null;
    }
    if(collaborators) {
      let tmp = [];
      tmp.push({label: "Select writer/collaborator", value: null})
      for (let i = 0; i < collaborators.length; i++) {
        if(collaborators[i].first_name) {
          tmp.push({label: collaborators[i].first_name +(collaborators[i].last_name ? ' '+collaborators[i].last_name : '') + ' - ' + collaborators[i].status ?? '', value: collaborators[i].id, status: collaborators[i].status});
        }
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
      if(collaborator ?? (selectedTrack ? selectedTrack.collaborator : false))
        data.append('artists_collaborator_id', collaborator ?? (selectedTrack.collaborator ? selectedTrack.collaborator.id : null))
      if(publisher ?? (selectedTrack ? selectedTrack.publisher : false))
        data.append('publisher_id', publisher ?? (selectedTrack.publisher ? selectedTrack.publisher.id : null))

      if(data.get("explicit"))
        data.set("explicit", true);
      else
        data.set("explicit", false);

      if(data.get("public_domain"))
        data.set("public_domain", true);
      else
        data.set("public_domain", false);

      if(isSubmitting) {
        const tmpCollaboratorId = collaborator ?? (selectedTrack ? (selectedTrack.collaborator ? selectedTrack.collaborator.id : null) : null);
        const tmp = collaboratorsDropdown.filter(item => item.value === tmpCollaboratorId);
        if(tmp.length > 0) {
          if(tmp[0].status !== 'accepted' && tmp[0].value !== null) {
            Notiflix.Report.Failure( 'Request failed', `Track whose writer/collaborator haven't accepted invite can't be submitted for classification.`, 'Ok' );
            setIsSubmitting(false);
            return false;
          } else {
            data.append('status', 'unclassified');
          }
        } else {
          data.append('status', 'unclassified');
        }
      } else {
        setIsLoading(true);
      }
      let url = selectedTrack ? `${BASE_URL}${ALBUMS}/${id}/tracks/${selectedTrack.id}` : `${BASE_URL}${ALBUMS}/${id}/tracks`;
      let artist_id = null;
      const userRole = artistState.userRole || JSON.parse(localStorage.getItem("userRole") ?? "");
      if(userRole === "collaborator") {
        artist_id = artistState.selectedArtist && artistState.selectedArtist.id;
        data.append("artist_id", artist_id)
        url = selectedTrack ? `${BASE_URL}${COLLABORATOR_ALBUMS}/${id}/tracks/${selectedTrack.id}` : `${BASE_URL}${COLLABORATOR_ALBUMS}/${id}/tracks`;
      }
      const userAuthToken = JSON.parse(localStorage.getItem("user") ?? "");
      const URL = url;
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
        Notiflix.Notify.Failure('Something went wrong, try later!');
      } else {
        const albums = await fetchAlbums(userRole === "collaborator" && artist_id);
        artistActions.albumsStateChanged(albums);
        const filteredAlbum = albums.filter(album => parseInt(album.id) === parseInt(id));
        setAlbum(filteredAlbum[0] ?? null)
        handleClose();
        e.target.reset();
        let message = isSubmitting ? "Track submitted for classification successfully" : `${selectedTrack ? "Track updated successfully" : "Track added to your album successfully"}`
        Notiflix.Report.Success( 'Request fulfilled', message, 'Ok' );
      }
      setIsSubmitting(false);
      setIsLoading(false);
    }
  }

  const handleAlbumDelete = async (e) => {
    e.preventDefault();
    Notiflix.Confirm.Show(
      'Please confirm',
      `Are you sure to delete album "${album.name}"?`,
      'Yes',
      'No',
      async function(){
        setIsDeleting(true);
        let url = `${BASE_URL}${ALBUMS}/${id}`;
        let artist_id = null;
        const userRole = artistState.userRole || JSON.parse(localStorage.getItem("userRole") ?? "");
        if(userRole === "collaborator") {
          artist_id = artistState.selectedArtist && artistState.selectedArtist.id;
          url = `${BASE_URL}${COLLABORATOR_ALBUMS}/${id}?artist_id=${artist_id}`;
        }
        const userAuthToken = JSON.parse(localStorage.getItem("user") ?? "");
        const response = await fetch(url,
          {
            headers: {
              "authorization": ACCESS_TOKEN,
              "auth-token": userAuthToken
            },
            method: "DELETE"
          });
        if (!response.ok) {
          Notiflix.Notify.Failure('Something went wrong, try later!');
          setIsDeleting(false);
        } else {
          const albums = await fetchAlbums(userRole === "collaborator" && artist_id);
          history.push(`/music`);
          artistActions.albumsStateChanged(albums);
          setIsDeleting(false);
          Notiflix.Notify.Success('Album deleted successfully!');
        }
      }
    );
  }

  const handleDeleteMusic = async (track) => {
    Notiflix.Confirm.Show(
      'Please confirm',
      `Are you sure to delete track "${track.title}"?`,
      'Yes',
      'No',
      async function(){
        let url = `${BASE_URL}${ALBUMS}/${id}/tracks/${track.id}`;
        let artist_id = null;
        const userRole = artistState.userRole || JSON.parse(localStorage.getItem("userRole") ?? "");
        if(userRole === "collaborator") {
          artist_id = artistState.selectedArtist && artistState.selectedArtist.id;
          url = `${BASE_URL}${COLLABORATOR_ALBUMS}/${id}/tracks/${track.id}?artist_id=${artist_id}`;
        }
        const userAuthToken = JSON.parse(localStorage.getItem("user") ?? "");
        const response = await fetch(url,
          {
            headers: {
              "authorization": ACCESS_TOKEN,
              "auth-token": userAuthToken
            },
            method: "DELETE"
          });
        if (!response.ok) {
          Notiflix.Notify.Failure('Something went wrong, try later!');
        } else {
          const albums = await fetchAlbums(userRole === "collaborator" && artist_id);
          artistActions.albumsStateChanged(albums);
          const filteredAlbum = albums.filter(album => parseInt(album.id) === parseInt(id));
          setAlbum(filteredAlbum[0] ?? null)
          Notiflix.Report.Success( 'Request fulfilled', `Track "${track.title}" deleted successfully!`, 'Ok' );
        }
      }
    );
  }

  const handleAddMusicModal = () => {
    setShowAddMusicModal(true);
  }

  const handleEditMusicModal = (track) => {
    setSelectedTrack(track);
    setShowAddMusicModal(true);
    setIsPublicDomain(track.public_domain === true || track.public_domain === "true" ? true : false);
    setIsExplicit(track.explicit === true || track.explicit === "true" ? true : false);
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
    setIsExplicit(false);
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

  const handleChangeExplicit = (e) => {
    setIsExplicit(!isExplicit)
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
            {(!artistState.selectedArtist || artistState.selectedArtist.access === 'write') &&
              <div className="sec-controls">
                <NavLink to={"/music/album/"+id+"/edit"} className="btn primary-btn mr-2">Edit</NavLink>
                {isDeletable
                  ? <a onClick={handleAlbumDelete} className={"close-btn btn delete"}>{isDeleting ? <>Deleting...<img className="loading" src={Loader} alt="icon"/></> : "Delete" }</a>
                  : <OverlayTrigger overlay={<Tooltip>Album whose track is under review or accepted can't be deleted.</Tooltip>}><a className={"close-btn btn delete"}>Delete</a></OverlayTrigger>
                }
              </div>
            }
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
            {(!artistState.selectedArtist || artistState.selectedArtist.access === 'write') &&
              <NavLink to={"/music/album/" + id + "/artwork"} className="btn primary-btn">Edit</NavLink>
            }
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
            {(!artistState.selectedArtist || artistState.selectedArtist.access === 'write') &&
              <a onClick={handleAddMusicModal} className="btn primary-btn mr-2">Add music</a>
            }
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
                      <div className="track-writter">
                        {track.collaborator
                          ? <>{track.collaborator.first_name} {track.collaborator.last_name} <small className={track.collaborator.status}><i>({track.collaborator.status})</i></small></>
                          : "-"
                        }
                      </div>
                      <div className="track-publisher">{track.publisher ? track.publisher.name : "-"}</div>
                      <div className="track-status">{track.status ? track.status.toLowerCase() === "unclassified" ? "Submitted for classification" : track.status : ""}</div>
                      {(!artistState.selectedArtist || artistState.selectedArtist.access === 'write')
                        ?
                          <div className="track-edit">
                            {track.status === "pending"
                              ?
                              <>
                                <a className="track-action" title="Edit track" onClick={(e) => handleEditMusicModal(track)}><img src={Edit} alt="Edit"/></a>
                                <a className="track-action" title="Delete track" onClick={(e) => handleDeleteMusic(track)}><img src={Delete} alt="Delete"/></a>
                              </>
                              :
                              <>
                                <OverlayTrigger overlay={<Tooltip>You can't edit this track, add a note if you want any changes.</Tooltip>}>
                                  <a className="disabled"><img src={EditDisable} alt="Edit"/></a>
                                </OverlayTrigger>
                                <OverlayTrigger overlay={<Tooltip>You can't delete this track, add a note if you want any changes.</Tooltip>}>
                                  <a className="disabled"><img src={DeleteDisable} alt="Delete"/></a>
                                </OverlayTrigger>
                                <Notes
                                  role={artistState.userRole || JSON.parse(localStorage.getItem("userRole") ?? "")}
                                  artist_id={artistState.selectedArtist ? artistState.selectedArtist.id : null}
                                  title={track.title}
                                  type={"Track"}
                                  id={track.id}
                                  tooltipPosition="top"
                                  tooltipText="Add a note here to request changes"
                                />
                              </>
                              }
                          </div>
                        :
                          <div className="track-edit">
                            <OverlayTrigger overlay={<Tooltip>You don't have access to edit track.</Tooltip>}>
                              <a className="disabled"><img src={EditDisable} alt="Edit"/></a>
                            </OverlayTrigger>
                            <OverlayTrigger overlay={<Tooltip>You don't have access to delete track.</Tooltip>}>
                              <a className="disabled"><img src={DeleteDisable} alt="Delete"/></a>
                            </OverlayTrigger>
                          </div>
                      }
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
                    <div className="form-group">
                      <Form.Control
                        name="lyrics"
                        defaultValue={selectedTrack ? selectedTrack.lyrics : ""}
                        placeholder="Add track lyrics here... (optional)"
                        as="textarea"
                        rows={4}
                      />
                    </div>
                  </Col>
                </Row>
                <Row>
                  <Col xs={12}>
                    <label htmlFor="explicit" className="form-group checkbox">
                      <input
                        name="explicit"
                        id="explicit"
                        type="checkbox"
                        onChange={handleChangeExplicit}
                        value={isExplicit}
                        checked={isExplicit}
                      />
                      Explicit Track
                      <span className={isExplicit ? "checkmark checked" : "checkmark"}></span>
                    </label>
                  </Col>
                </Row>
                <Row>
                  <Col xs={12}>
                  <label htmlFor="public_domain" className="form-group checkbox">
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
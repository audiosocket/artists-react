import React, {useEffect, useRef, useState} from "react";
import "./Music.scss";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import {ArtistContext} from "../../../../Store/artistContext";
import fetchAlbums from "../../../../common/utlis/fetchAlbums";
import Loader from "../../../../images/loader.svg";
import Edit from "../../../../images/pencil.svg";
import {
  ACCESS_TOKEN,
  ALBUMS,
  ARTISTS_COLLABORATORS,
  BASE_URL, COLLABORATOR_ALBUMS,
  COLLABORATOR_ARTIST_COLLABORATORS, COLLABORATOR_INVITE_COLLABORATORS,
  INVITE_COLLABORATORS
} from "../../../../common/api";
import Form from "react-bootstrap/Form";
import {NavLink} from "react-router-dom";
import Breadcrumb from 'react-bootstrap/Breadcrumb';
import Delete from "../../../../images/delete.svg";
import DeleteDisable from "../../../../images/delete-slash.png";
import Tooltip from "react-bootstrap/Tooltip";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Notiflix from "notiflix";
import Notes from "../../../../common/Notes/Notes";

function AlbumsListing() {
  const {artistState, artistActions} = React.useContext(ArtistContext);
  const form = useRef(null);
  const [validated, setValidated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [albums, setAlbums] = useState([]);
  const [showAlbumModal, setShowAlbumModal] = useState(false);
  const [selectedAlbum, setSelectedAlbum] = useState(null);
  const [selectedAlbumDate, setSelectedAlbumDate] = useState('');
  const [artwork, setArtwork] = useState(null);

  useEffect(() => {
    if (artistState.albums)
      setAlbums(artistState.albums)
  }, [artistState.albums])

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
      if(!artwork) {
        data.delete("artwork");
      }
      let url = selectedAlbum ? `${BASE_URL}${ALBUMS}/${selectedAlbum.id}` : `${BASE_URL}${ALBUMS}`;
      let artist_id = null;
      const userRole = artistState.userRole || JSON.parse(localStorage.getItem("userRole") ?? "");
      if(userRole === "collaborator") {
        artist_id =  artistState.selectedArtist && artistState.selectedArtist.id;
        data.append("artist_id", artist_id);
        url = selectedAlbum ? `${BASE_URL}${COLLABORATOR_ALBUMS}/${selectedAlbum.id}` : `${BASE_URL}${COLLABORATOR_ALBUMS}`;
      }
      const userAuthToken = JSON.parse(localStorage.getItem("user") ?? "");
      const response = await fetch(url,
        {
          headers: {
            "authorization": ACCESS_TOKEN,
            "auth-token": userAuthToken
          },
          method: selectedAlbum ? "PATCH" : "POST",
          body: data
        });
      if (!response.ok) {
        Notiflix.Notify.failure('Something went wrong, try later!', {
          timeout: 6000000,
          clickToClose: true,
        });
      } else {
        if(artwork) {
          const result = await response.json();
          let artworkURL = `${BASE_URL}${ALBUMS}/${result.id}/update_artwork`;
          if(userRole === "collaborator") {
            artworkURL = `${BASE_URL}${COLLABORATOR_ALBUMS}/${result.id}/update_artwork?artist_id=${artist_id}`;
          }
          const responseArtwork = await fetch(artworkURL,
            {
              headers: {
                "authorization": ACCESS_TOKEN,
                "auth-token": userAuthToken
              },
              method: "PATCH",
              body: data
            });
          if (!responseArtwork.ok) {
            Notiflix.Notify.failure('Something went wrong, try later!', {
              timeout: 6000000,
              clickToClose: true,
            });
          }
        }
        const albums = await fetchAlbums(userRole === "collaborator" && artist_id);
        setAlbums(albums);
        artistActions.albumsStateChanged(albums);
        handleClose();
        e.target.reset();
        Notiflix.Notify.success(`Album ${selectedAlbum ? "updated" : "created"} successfully!`);
      }
      setIsLoading(false);
    }
  }

  const handleClose = () => {
    setShowAlbumModal(false);
    setValidated(false);
    setSelectedAlbum(null);
    setSelectedAlbumDate('');
    if(form.current) {
      form.current.reset()
    }
    setArtwork(null);
  }

  const handleAlbumEditModal = (album) => {
    setSelectedAlbum(album);
    setShowAlbumModal(true);
    if(album.release_date) {
      setSelectedAlbumDate(album.release_date);
    }
  }

  const handleAlbumDelete = async (album) => {
    Notiflix.Confirm.show(
      'Please confirm',
      `Are you sure to delete album "${album.name}"?`,
      'Yes',
      'No',
      async function(){
        let url = `${BASE_URL}${ALBUMS}/${album.id}`;
        let artist_id = null;
        const userRole = artistState.userRole || JSON.parse(localStorage.getItem("userRole") ?? "");
        if(userRole === "collaborator") {
          artist_id = artistState.selectedArtist && artistState.selectedArtist.id;
          url = `${BASE_URL}${COLLABORATOR_ALBUMS}/${album.id}?artist_id=${artist_id}`;
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
          Notiflix.Notify.failure('Something went wrong, try later!', {
            timeout: 6000000,
            clickToClose: true,
          });
        } else {
          Notiflix.Report.success( 'Request fulfilled', `Album "${album.name}" deleted successfully!`, 'Ok' );
          const albums = await fetchAlbums(userRole === "collaborator" && artist_id);
          artistActions.albumsStateChanged(albums);
          setAlbums(albums);
        }
      }
    );
  }

  const handleUploadArtwork = (e) => {
    let img = e.target.files[0];
    let reader = new FileReader();
    //Read the contents of Image File.
    reader.readAsDataURL(e.target.files[0]);
    reader.onload = function (e) {
      //Initiate the JavaScript Image object.
      let image = new Image();
      //Set the Base64 string return from FileReader as source.
      image.src = e.target.result;
      //Validate the File Height and Width.
      image.onload = function () {
        let height = this.height;
        let width = this.width;
        if (width < 353 || height < 353) {
          Notiflix.Report.warning( 'Upload failed', `Artwork Image must be min 350px x 350px\nUploaded image is ${width}px x ${height}!`, 'Ok' );
          return false;
        } else {
          setArtwork(img)
          return true;
        }
      };
    };
  }

  return (
    <div className="musicWrapper">
      <div className="asBreadcrumbs">
        <Breadcrumb>
          <li className="breadcrumb-item">
            <NavLink to="/">Home</NavLink>
          </li>
          <li className="breadcrumb-item">
            Music
          </li>
          <li className="breadcrumb-item active">
            Albums
          </li>
        </Breadcrumb>
      </div>
      <div className="agreementBody">
        <section>
          <div className="bg-content yellow bgSecondVersion mt-4">
            <h4 className="mb-3"><strong>Create new albums and upload tracks to your portal</strong></h4>
            <p>Please choose your album titles wisely, as they will now appear on the front end. Please do not include dates or other extensions in album titles.</p>
            <p>You and your collaborators must own 100% of the master and publishing rights to the music you're submitting. <strong className="text-danger">No covers or samples please</strong>.</p>
            <p>When uploading tracks, please review your track names. Tracks should be edited to include what you would like them displayed as Ex: <strong><i>"Track Name master WAV"</i></strong> should be edited to <strong><i>"Track Name"</i></strong>.</p>
            <p>Our clients love Instrumental and alternative versions, stems, SFX & SF. If you have any of these, please upload them as well. Stems can be uploaded within the same album as the main versions live. If you're also uploading stems, please make sure to describe it under the track name. Ex: <strong><i>"Track Name (STEM-Strings Only)"</i></strong></p>
            <p className="mb-0">If tracks are explicit, please mark as such in the title. Please include a clean version.</p>
          </div>
        </section>
        <section className="pt-4">
          <div className="section-head">
            <h2>Albums</h2>
            {(!artistState.selectedArtist || artistState.selectedArtist.access === 'write') &&
              <a onClick={() => setShowAlbumModal(true)} className="btn primary-btn">Create an album</a>
            }
          </div>
          {albums.length === 0 && isLoading && <h5>Loading albums... <img className="loading" src={Loader} alt="loading-icon"/></h5>}
          <div className="music-playlist">
            <ul className="music-row">
              {albums.length !== 0
                ? albums.map((album, key) => {
                  return (
                    <li key={key}>
                      <NavLink
                        to={`/music/album/${album.id}`}>{album.name} <small><i>{album.release_date ? "(Release date: " + album.release_date + ")" : ""}</i></small>
                      </NavLink>
                      {(!artistState.selectedArtist || artistState.selectedArtist.access === 'write') &&
                        <div className="album-actions">
                          <img onClick={(e) => handleAlbumEditModal(album)} src={Edit} alt="edit-icon"/>
                          {album.tracks.length > 0 && album.tracks.filter(track => (track.status === "unclassified" || track.status === "accepted")).length > 0
                            ?
                              <>
                                <OverlayTrigger overlay={<Tooltip>Album whose track is under review or accepted can't be deleted</Tooltip>}><img className="disable-delete" src={DeleteDisable} alt="Disable Delete"/></OverlayTrigger>
                                <Notes
                                  role={artistState.userRole || JSON.parse(localStorage.getItem("userRole") ?? "")}
                                  artist_id={artistState.selectedArtist ? artistState.selectedArtist.id : null}
                                  title={album.name}
                                  type={"Album"}
                                  id={album.id}
                                  tooltipPosition="top"
                                  tooltipText="Add a note here to delete album"
                                />
                              </>
                            : <img onClick={(e) => handleAlbumDelete(album)} src={Delete} alt="delete-icon"/>
                          }
                        </div>
                      }
                    </li>
                  )
                })
                : !isLoading && <p>No album created yet! Click <i className="medium-text">Create an album</i> button above to get started.</p>
              }
            </ul>
          </div>
        </section>
      </div>
      {showAlbumModal &&
      <Modal
        show={showAlbumModal}
        onHide={handleClose}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        className="customArtistModal"
      >
        <Form noValidate validated={validated} ref={form} onSubmit={handleCreateAlbum}>
          <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title-vcenter">
              {selectedAlbum
                ? `Edit album ${artistState.artist ? "for " + artistState.artist.name : ""}`
                : `New album ${artistState.artist ? "for " + artistState.artist.name : ""}`
              }
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
                        defaultValue={selectedAlbum ? selectedAlbum.name : ''}
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
                        name="release_date"
                        defaultValue={selectedAlbumDate ? selectedAlbumDate : ''}
                        type="text"
                        onFocus={(e) => (e.currentTarget.type = "date")}
                        onBlur={(e) => (e.currentTarget.type = "text")}
                        placeholder="Release Date"
                      />
                      <small className="text-muted">Release date is optional</small>
                    </div>
                  </Col>
                </Row>
                <Row>
                  <Col xs={12}>
                    <div className="form-group">
                      <Form.File
                        accept=".png, .jpg, .svg"
                        onChange={handleUploadArtwork}
                        name="artwork"
                        label={artwork ? artwork.name : selectedAlbum && selectedAlbum.artwork ? selectedAlbum.artwork.split('/')[selectedAlbum.artwork.split("/").length-1] : "No file chosen (optional)"}
                        lang="en"
                        data-browse="Select artwork"
                        custom
                      />
                      <small className="info-text"><i>You can add the album artwork later</i></small>
                      <small className="info-text"><i>Minimum required size for artwork is 350px x 350px and required shape is square</i></small>
                    </div>
                  </Col>
                </Row>
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button className="btn btn-outline-light" onClick={handleClose}>Cancel</Button>
            {!selectedAlbum
              ? <Button type="submit" className="btn primary-btn submit">{isLoading ? <>Creating...<img src={Loader} alt="icon"/></> : "Create Album"}</Button>
              : <Button type="submit" className="btn primary-btn submit">{isLoading ? <>Saving...<img src={Loader} alt="icon"/></> : "Save"}</Button>
            }
          </Modal.Footer>
        </Form>
      </Modal>
      }
    </div>
  )
}

export default AlbumsListing;
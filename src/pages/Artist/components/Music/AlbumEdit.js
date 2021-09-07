import React, {useEffect, useRef, useState} from "react";
import "./Music.scss";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import {ArtistContext} from "../../../../Store/artistContext";
import fetchAlbums from "../../../../common/utlis/fetchAlbums";
import {ACCESS_TOKEN, ALBUMS, BASE_URL, COLLABORATOR_ALBUMS} from "../../../../common/api";
import {NavLink, useHistory} from "react-router-dom";
import {Breadcrumb} from "react-bootstrap";
import Loader from "../../../../images/loader.svg";
import Button from "react-bootstrap/Button";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import Notiflix from "notiflix";

function AlbumEdit({id = null}) {
  const {artistState, artistActions} = React.useContext(ArtistContext);
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [validated, setValidated] = useState(false);
  const form = useRef(false);
  const [album, setAlbum] = useState(null);
  const [selectedAlbumDate, setSelectedAlbumDate] = useState('');
  const history = useHistory();
  const [isDeletable, setIsDeletable] = useState(true);

  useEffect(() => {
    if(artistState.albums) {
      const filteredAlbum = artistState.albums.filter(album => parseInt(album.id) === parseInt(id));
      if(filteredAlbum.length > 0) {
        setAlbum(filteredAlbum[0] ?? null)
        if(filteredAlbum[0].release_date) {
          setSelectedAlbumDate(filteredAlbum[0].release_date);
        }
        if(filteredAlbum[0].tracks.length) {
          const isDeletable = filteredAlbum[0].tracks.filter(track => (track.status === "unclassified" || track.status === "accepeted"));
          if(isDeletable.length > 0) {
            setIsDeletable(false);
          }
        }
      } else {
        history.push('/music');
        Notiflix.Report.Failure( 'Invalid album', `Album doesn't exist`, 'Ok');
      }
    }
  }, [artistState.albums])

  const handleSubmitEditAlbum = async (e) => {
    e.preventDefault();
    const albumForm = e.currentTarget;
    if (albumForm.checkValidity() === false) {
      e.preventDefault();
      e.stopPropagation();
      setValidated(true);
    } else {
      setIsLoading(true);
      const data = new FormData(form.current);
      let url = `${BASE_URL}${ALBUMS}/${id}`;
      let artist_id = null;
      const userRole = artistState.userRole || JSON.parse(localStorage.getItem("userRole") ?? "");
      if(userRole === "collaborator") {
        artist_id =  artistState.selectedArtist && artistState.selectedArtist.id;
        data.append("artist_id", artist_id);
        url = `${BASE_URL}${COLLABORATOR_ALBUMS}/${id}`;
      }
      const userAuthToken = JSON.parse(localStorage.getItem("user") ?? "");
      const response = await fetch(url,
        {
          headers: {
            "authorization": ACCESS_TOKEN,
            "auth-token": userAuthToken
          },
          method: "PATCH",
          body: data
        });
      if (!response.ok) {
        Notiflix.Notify.Failure('Something went wrong, try later!');
      } else {
        const albums = await fetchAlbums(userRole === "collaborator" && artist_id);
        artistActions.albumsStateChanged(albums);
        Notiflix.Notify.Success('Album updated successfully!');
        history.push(`/music/album/${id}`);
      }
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

  return (
    <div className="albumsWrapper edit">
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
          <li className="breadcrumb-item">
            <NavLink to={"/music/album/"+id}>{album ? album.name : ''}</NavLink>
          </li>
          <li className="breadcrumb-item active">
            Edit Album
          </li>
        </Breadcrumb>
      </div>
      <div className="section-content">
        <section >
          <div className="section-head">
            <h2>Edit Album</h2>
            <div className="sec-controls">
              {isDeletable
                ? <a onClick={handleAlbumDelete} className={"close-btn btn delete"}>{isDeleting ? <>Deleting...<img className="loading" src={Loader} alt="icon"/></> : "Delete" }</a>
                : <OverlayTrigger overlay={<Tooltip>Album whose track is under review or accepted can't be deleted.</Tooltip>}><a className={"close-btn btn delete"}>Delete</a></OverlayTrigger>
              }
            </div>
          </div>
        </section>
        {isLoading && !album && <h5>Loading album... <img className="loading" src={Loader} alt="loading-icon"/></h5>}
        <Form noValidate validated={validated} ref={form} onSubmit={handleSubmitEditAlbum}>
          <div className="section">
            <Row>
              <Col xl={2} md={4}>
                <Form.Label className="mb-2">Album Name*</Form.Label>
              </Col>
              <Col xl={4} md={8}>
                <Form.Control
                  required
                  name="name"
                  type="text"
                  defaultValue={album ? album.name : ''}
                  placeholder="Album Name*"
                />
                <Form.Control.Feedback type="invalid">
                  Album name is required!
                </Form.Control.Feedback>
              </Col>
            </Row>
            <Row>
              <Col xl={2} md={4}>
                <Form.Label className="mb-2">Release Date</Form.Label>
              </Col>
              <Col xl={4} md={8}>
                <Form.Control
                  name="release_date"
                  defaultValue={selectedAlbumDate ? selectedAlbumDate : ''}
                  type="date"
                  placeholder="Release Date"
                />
                <small className="text-muted">Release date is optional</small>
              </Col>
            </Row>
          </div>
          <Row>
            <Col xl={2} md={0}></Col>
            <Col xl={4} md={12} className="text-center mt-4">
              <NavLink to={"/music/album/"+id} className="btn primary-btn btn-outline-light mr-5 cancel">Cancel</NavLink>
              <Button type="submit" className="btn primary-btn submit">{isLoading ? <>Saving...<img className="loading" src={Loader} alt="icon"/></> : "Save" }</Button>
            </Col>
          </Row>
        </Form>
      </div>
    </div>
  )
}

export default AlbumEdit;
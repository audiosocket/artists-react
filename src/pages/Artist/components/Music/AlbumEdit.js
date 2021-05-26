import React, {useEffect, useRef, useState} from "react";
import "./Music.scss";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import {ArtistContext} from "../../../../Store/artistContext";
import fetchAlbums from "../../../../common/utlis/fetchAlbums";
import {ACCESS_TOKEN, ALBUMS, BASE_URL} from "../../../../common/api";
import {NavLink, useHistory} from "react-router-dom";
import {Breadcrumb} from "react-bootstrap";
import Loader from "../../../../images/loader.svg";
import Button from "react-bootstrap/Button";

function AlbumEdit({id = null}) {
  const {artistState, artistActions} = React.useContext(ArtistContext);
  const [isLoading, setIsLoading] = useState(false);
  const [validated, setValidated] = useState(false);
  const form = useRef(false);
  const [album, setAlbum] = useState(null);
  const [selectedAlbumDate, setSelectedAlbumDate] = useState('');
  const history = useHistory();

  useEffect(() => {
    if(artistState.albums) {
      const filteredAlbum = artistState.albums.filter(album => parseInt(album.id) === parseInt(id));
      setAlbum(filteredAlbum[0] ?? null)
      if(filteredAlbum[0].release_date) {
        const day = filteredAlbum[0].release_date.substr(0,2);
        const month = filteredAlbum[0].release_date.substr(3,2);
        const year = filteredAlbum[0].release_date.substr(6,4);
        setSelectedAlbumDate(`${year}-${month}-${day}`);
      }
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
    if(filteredAlbum[0].release_date) {
      const day = filteredAlbum[0].release_date.substr(0,2);
      const month = filteredAlbum[0].release_date.substr(3,2);
      const year = filteredAlbum[0].release_date.substr(6,4);
      setSelectedAlbumDate(`${year}-${month}-${day}`);
    }
    setIsLoading(false);
  }

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
      const userAuthToken = JSON.parse(localStorage.getItem("user") ?? "");
      const response = await fetch(`${BASE_URL}${ALBUMS}/${id}`,
        {
          headers: {
            "authorization": ACCESS_TOKEN,
            "auth-token": userAuthToken
          },
          method: "PATCH",
          body: data
        });
      if (!response.ok) {
        alert('Something went wrong, try later!');
      } else {
        const albums = await fetchAlbums();
        artistActions.albumsStateChanged(albums);
        history.push(`/music/album/${id}`);
      }
      setIsLoading(false);
    }
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
          <li className="breadcrumb-item active">
            {album ? album.name : ''}
          </li>
        </Breadcrumb>
      </div>
      <div className="section-content">
        <section >
          <div className="section-head">
            <h2>{album ? album.name : ''}</h2>
          </div>
        </section>
        {isLoading && !album && <h5>Loading album... <img className="loading" src={Loader} alt="loading-icon"/></h5>}
        <Form noValidate validated={validated} ref={form} onSubmit={handleSubmitEditAlbum}>
          <div className="section">
            <Row>
              <Col xl={2} md={6}>
                <Form.Label>Album Name*</Form.Label>
              </Col>
              <Col xl={4} md={6}>
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
              <Col xl={2} md={6}>
                <Form.Label>Album Name*</Form.Label>
              </Col>
              <Col xl={4} md={6}>
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
            <Col xl={2} md={6}></Col>
            <Col xl={4} md={6} className="text-center">
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
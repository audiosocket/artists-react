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

function AlbumArtwrok({id = null}) {
  const {artistState, artistActions} = React.useContext(ArtistContext);
  const [isLoading, setIsLoading] = useState(false);
  const [validated, setValidated] = useState(false);
  const form = useRef(false);
  const [album, setAlbum] = useState(null);
  const [artwork, setArtwork] = useState(null);
  const history = useHistory();

  useEffect(() => {
    if(artistState.albums) {
      const filteredAlbum = artistState.albums.filter(album => parseInt(album.id) === parseInt(id));
      setAlbum(filteredAlbum[0] ?? null)
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

  const handleSubmitEditArtwork = async (e) => {
    e.preventDefault();
    const albumForm = e.currentTarget;
    if(!artwork) {
      alert("Update artwork before saving!")
    }
    if (albumForm.checkValidity() === false) {
      e.preventDefault();
      e.stopPropagation();
      setValidated(true);
    } else {
      if(!artwork) {
        return false;
      }
      setIsLoading(true);
      const data = new FormData(form.current);
      const userAuthToken = JSON.parse(localStorage.getItem("user") ?? "");
      const response = await fetch(`${BASE_URL}${ALBUMS}/${id}/update_artwork`,
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
          alert("Artwork Image must be min 353px x 353px\nUploaded image is "+width+"px x "+height+"px!");
          return false;
        } else {
          setArtwork(img)
          return false;
        }
      };
    };
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
            Artwork
          </li>
        </Breadcrumb>
      </div>
      <div className="section-content">
        <section >
          <div className="section-head">
            <h2>Artwork</h2>
          </div>
        </section>
        {isLoading && !album && <h5>Loading album... <img className="loading" src={Loader} alt="loading-icon"/></h5>}
        <Form noValidate validated={validated} ref={form} onSubmit={handleSubmitEditArtwork}>
          <div className="section">
            <Row>
              <Col xl={2} md={6}>
                <Form.Label>Artwork</Form.Label>
              </Col>
              <Col xl={4} md={6}>
                <Form.File
                  required
                  accept=".png, .jpg, .svg"
                  onChange={(e) => { handleUploadArtwork(e)}}
                  name="artwork"
                  label={artwork ? artwork.name : album && album.artwork ? album.artwork.split('/')[album.artwork.split("/").length-1] : ""}
                  lang="en"
                  data-browse="Select artwork"
                  custom
                />
                {album &&
                  <img className="preview" src={artwork ? URL.createObjectURL(artwork) : album.artwork}></img>
                }
              </Col>
            </Row>
          </div>
          <Row>
            <Col xl={2} md={6}></Col>
            <Col xl={4} md={6} className="text-center mt-4">
              <NavLink to={"/music/album/"+id} className="btn primary-btn btn-outline-light mr-5 cancel">Cancel</NavLink>
              <Button type="submit" className="btn primary-btn submit">{isLoading ? <>Saving...<img className="loading" src={Loader} alt="icon"/></> : "Save" }</Button>
            </Col>
          </Row>
        </Form>
      </div>
    </div>
  )
}

export default AlbumArtwrok;
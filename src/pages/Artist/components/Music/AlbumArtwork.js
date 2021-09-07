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
import Notiflix from "notiflix";

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
      if(filteredAlbum.length > 0)
        setAlbum(filteredAlbum[0]);
      else {
        history.push('/music');
        Notiflix.Report.failure( 'Invalid album', `Album doesn't exist`, 'Ok');
      }
    }
  }, [artistState.albums])

  const handleSubmitEditArtwork = async (e) => {
    e.preventDefault();
    const albumForm = e.currentTarget;
    if(!artwork) {
      Notiflix.Report.info( 'Select artwork', `Please select artwork image for your album before saving!`, 'Ok' );
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
      let url = `${BASE_URL}${ALBUMS}/${id}/update_artwork`;
      let artist_id = null;
      const userRole = artistState.userRole || JSON.parse(localStorage.getItem("userRole") ?? "");
      if(userRole === "collaborator") {
        artist_id =  artistState.selectedArtist && artistState.selectedArtist.id;
        data.append("artist_id", artist_id);
        url = `${BASE_URL}${COLLABORATOR_ALBUMS}/${id}/update_artwork`;
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
        Notiflix.Notify.failure('Something went wrong, try later!');
      } else {
        const albums = await fetchAlbums(userRole === "collaborator" && artist_id);
        artistActions.albumsStateChanged(albums);
        Notiflix.Notify.success('Arwork updated successfully!');
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
          Notiflix.Report.warning( 'Upload failed', `Artwork Image must be min 353px x 353px\nUploaded image is ${width}px x ${height}!`, 'Ok' );
          return false;
        } else {
          setArtwork(img)
          return true;
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
              <Col xl={2} md={4}>
                <Form.Label className="mb-2">Artwork*</Form.Label>
              </Col>
              <Col xl={4} md={8}>
                <Form.File
                  required
                  accept=".png, .jpg, .svg"
                  onChange={(e) => { handleUploadArtwork(e)}}
                  name="artwork"
                  label={artwork ? artwork.name : album && album.artwork ? album.artwork.split('/')[album.artwork.split("/").length-1] : "No file chosen"}
                  lang="en"
                  data-browse="Select artwork"
                  custom
                />
                <small className="info-text"><i>Minimum required size for artwork is 353px x 353px</i></small>
                {album &&
                  <img className="preview" src={artwork ? URL.createObjectURL(artwork) : album.artwork}></img>
                }
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

export default AlbumArtwrok;
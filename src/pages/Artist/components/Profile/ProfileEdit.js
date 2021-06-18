import React, {useEffect, useRef, useState} from "react";
import "./Profile.scss";
import {ArtistContext} from "../../../../Store/artistContext";
import fetchArtist from "../../../../common/utlis/fetchArtist";
import Loader from "../../../../images/loader.svg";
import {NavLink, useHistory} from "react-router-dom";
import Form from "react-bootstrap/Form";
import {Col, Row} from "react-bootstrap";
import Button from "react-bootstrap/Button";
import {ACCESS_TOKEN, ARTIST_PROFILE_UPDATE, BASE_URL} from "../../../../common/api";
import DropzoneComponent from "../../../../common/Dropzone/DropzoneComponent";
import Breadcrumb from "react-bootstrap/Breadcrumb";
import Notes from "../../../../common/Notes/Notes";
import fetchNotes from "../../../../common/utlis/fetchNotes";
import Notiflix from "notiflix-react";

function ProfileEdit() {
  const {artistState, artistActions} = React.useContext(ArtistContext);
  const [isLoading, setIsLoading] = useState(false);
  const [artist, setArtist] = useState({});
  const history = useHistory();
  const form = useRef(null);
  const [validated, setValidated] = useState(false);
  const [bioLimitFlag, setBioLimitFlag] = useState(false);
  const [coverImage, setCoverImage] = useState(null);
  const [bannerImage, setBannerImage] = useState(null);
  const [image, setImage] = useState([]);
  const [notes, setNotes] = useState([]);
  const [profileSubmit, setProfileSubmit] = useState(false);

  useEffect(() => {
    getNotes();
    if(!artistState.artist)
      getArtistProfile();
    else
      setArtist(artistState.artist);
  }, [artistState.artist])

  const getNotes = async () => {
    setIsLoading(true);
    const notes = await fetchNotes();
    setNotes(notes);
    setIsLoading(false);
  }

  const getArtistProfile = async () => {
    setIsLoading(true);
    const artist = await fetchArtist();
    artistActions.artistStateChanged(artist);
    setArtist(artist);
    setIsLoading(false);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if(!profileSubmit)
      return false;
    const artistForm = e.currentTarget;
    if (artistForm.checkValidity() === false) {
      e.preventDefault();
      e.stopPropagation();
      setValidated(true);
    } else {
      const data = new FormData(form.current);

      if(!handleBioCharacterChange(data.get('bio')))
        return false;

      setIsLoading(true);
      if(!coverImage)
        data.delete('cover_image')
      if(!bannerImage)
        data.delete('banner_image')
      if(image.length) {
        for(let i = 0; i < image.length; i++)
          data.append('additional_images[]', image[i]);
      }
      data.delete('name');
      const userAuthToken = JSON.parse(localStorage.getItem("user") ?? "");
      const response = await fetch(`${BASE_URL}${ARTIST_PROFILE_UPDATE}`,
        {
          headers: {
            "authorization": ACCESS_TOKEN,
            "auth-token": userAuthToken
          },
          method: 'PATCH',
          body: data
        });
      const artist = await response.json();
      if(!response.ok) {
        Notiflix.Notify.Failure('Something went wrong, try later!');
        setProfileSubmit(false);
      } else {
        setProfileSubmit(false);
        setArtist(artist);
        artistActions.artistStateChanged(artist);
        Notiflix.Notify.Success('Profile updated!');
        history.push('/profile');
      }
      setIsLoading(false);
    }
  }

  const handleBioCharacterChange = (value) => {
    setBioLimitFlag(false);
    if(value.length > 400) {
      setBioLimitFlag(true);
      return false;
    } else
      return true
  }

  const handleUploadImages = (images) => {
    setImage(images);
  }

  const handleUploadCover = (e) => {
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
          alert("Cover Image must be min 353px x 353px\nUploaded image is "+width+"px x "+height+"px!");
          return false;
        } else {
          setCoverImage(img)
          return false;
        }
      };
    };
  }

  const handleUploadBanner = (e) => {
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
        if (width < 1440 || height < 448) {
          alert("Banner Image must be min 1440px x 448px\nUploaded image is "+width+"px x "+height+"px!");
          return false;
        } else {
          setBannerImage(img)
          return true;
        }
      };
    };
  }

  const handleChangeNotes = (notes) => {
    setNotes(notes);
  }

  const handleProfileSubmit = () => {
    setProfileSubmit(true);
  }

  return (
    <div className="artist-wrapper">
      <div className="asBreadcrumbs">
        <Breadcrumb>
          <li className="breadcrumb-item">
            <NavLink to="/">Home</NavLink>
          </li>
          <li className="breadcrumb-item">
            <NavLink to="/profile">Profile</NavLink>
          </li>
          <li className="breadcrumb-item active">
            Edit Profile
          </li>
        </Breadcrumb>
      </div>
      <section className="artist-section-control">
        <div className="section-content">
          <div className="section-head">
            <h2>Edit Profile</h2>
          </div>
          <div className="section-body">
            <div className="w-custom-percent">
              {Object.keys(artist).length === 0 && isLoading && <h5>Loading profile... <img className="loading" src={Loader} alt="loading-icon"/></h5>}
              {Object.keys(artist).length !== 0 &&
                <Form noValidate validated={validated} ref={form} onSubmit={handleSubmit}>
                  <Row>
                    <Col xl={2} md={6}>
                      <Form.Label>Artist Name</Form.Label>
                    </Col>
                    <Col xl={4} md={6}>
                      <Form.Control
                        readOnly={true}
                        name="name"
                        defaultValue={artist.name}
                        type="text"
                      />
                    </Col>
                    {!isLoading &&
                      <Notes type={"ArtistProfile"} notes={notes} notable_id={artist.id} onChangeNotes={handleChangeNotes} />
                    }
                  </Row>
                  <Row>
                    <Col xl={2} md={6}>
                      <Form.Label>Cover Image</Form.Label>
                    </Col>
                    <Col xl={4} md={6}>
                      <Form.File
                        accept=".png, .jpg, .svg"
                        onChange={(e) => {handleUploadCover(e)}}
                        name="cover_image"
                        label={coverImage ? coverImage.name : artist.cover_image ? artist.cover_image.split('/')[artist.cover_image.split("/").length-1] : ""}
                        lang="en"
                        custom
                      />
                      <img className="preview" src={coverImage ? URL.createObjectURL(coverImage) : artist.cover_image}></img>
                    </Col>
                  </Row>
                  <Row>
                    <Col xl={2} md={6}>
                      <Form.Label>Banner Image</Form.Label>
                    </Col>
                    <Col xl={4} md={6}>
                      <Form.File
                        accept=".png, .jpg, .svg"
                        onChange={(e) => {handleUploadBanner(e)}}
                        name="banner_image"
                        label={bannerImage ? bannerImage.name : artist.banner_image ? artist.banner_image.split('/')[artist.banner_image.split("/").length-1] : ""}
                        lang="en"
                        custom
                      />
                      <img className="preview" src={bannerImage ? URL.createObjectURL(bannerImage) : artist.banner_image}></img>
                    </Col>
                  </Row>
                  <div className="parallel-info row">
                    <Col xl={2} md={6}>
                      <Form.Label>Additional Images</Form.Label>
                    </Col>
                    <Col xl={10} md={10}>
                      <div className="info-ans additional-elements image">
                        {artist.additional_images.length !== 0 &&
                          artist.additional_images.map((image, key) => {
                            return (
                              <img key={key} className="additional-image" src={image} alt="Image" />
                            )
                          })
                        }
                      </div>
                    </Col>
                  </div>
                  <Row>
                    <Col xl={2} md={6}></Col>
                    <Col xl={4} md={6}>
                      <DropzoneComponent uploadedFiles={artist.additional_images ?? []} onUploadImages={handleUploadImages} />
                    </Col>
                  </Row>
                  <Row>
                    <Col xl={2} md={6}>
                      <Form.Label>Sounds Like</Form.Label>
                    </Col>
                    <Col xl={4} md={6}>
                      <Form.Control
                        name="sounds_like"
                        defaultValue={artist.sounds_like}
                        type="text"
                        placeholder="Fats Domino, Trombone Shorty, Irina thomas"
                      />
                    </Col>
                  </Row>
                  <Row>
                    <Col xl={2} md={6}>
                      <Form.Label>Bio</Form.Label>
                    </Col>
                    <Col xl={4} md={6}>
                      <Form.Control
                        name="bio"
                        defaultValue={artist.bio}
                        placeholder="Write bio here"
                        as="textarea"
                        rows={4}
                        onChange={(e) => handleBioCharacterChange(e.target.value)}
                        className={bioLimitFlag ? 'invalid' : ''}
                      />
                      {bioLimitFlag && <div className="custom-invalid-feedback">Max of 400 characters allowed!</div> }
                    </Col>
                  </Row>
                  <Row>
                    <Col xl={2} md={6}>
                      <Form.Label>Key Facts</Form.Label>
                    </Col>
                    <Col xl={4} md={6}>
                      <Form.Control
                        name="key_facts"
                        defaultValue={artist.key_facts}
                        type="text"
                        placeholder="Key Facts"
                      />
                    </Col>
                  </Row>
                  <Row>
                    <Col xl={2} md={6}>
                      <Form.Label>Social Links</Form.Label>
                    </Col>
                    <Col xl={4} md={6}>
                      <Form.Control
                        name="social[]"
                        defaultValue={artist.social[0] ?? ""}
                        type="text"
                        placeholder="Social link 1"
                        className="mb-1"
                      />
                      <Form.Control
                        name="social[]"
                        defaultValue={artist.social[1] ?? ""}
                        type="text"
                        placeholder="Social link 2"
                        className="mb-1"
                      />
                      <Form.Control
                        name="social[]"
                        defaultValue={artist.social[2] ?? ""}
                        type="text"
                        placeholder="Social link 3"
                        className="mb-1"
                      />
                    </Col>
                  </Row>
                  <Row>
                    <Col xl={2} md={6}></Col>
                    <Col xl={4} md={6} className="text-center">
                      <NavLink to="/profile" className="btn primary-btn btn-outline-light mr-5 cancel">Cancel</NavLink>
                      <Button type="submit" onClick={handleProfileSubmit} className="btn primary-btn submit">{isLoading ? <>Saving...<img className="" src={Loader} alt="icon"/></> : "Save" }</Button>
                    </Col>
                  </Row>
                </Form>
              }
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default ProfileEdit;
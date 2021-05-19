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

function ProfileEdit() {
  const {artistState, artistActions} = React.useContext(ArtistContext);
  const [isLoading, setIsLoading] = useState(false);
  const [artist, setArtist] = useState({});
  const history = useHistory();
  const form = useRef(null);
  const [validated, setValidated] = useState(false);
  const [bioLimitFlag, setBioLimitFlag] = useState(false);
  const [image, setImage] = useState(null);

  useEffect(() => {
    if(!artistState.artist)
      getArtistProfile();
    else
      setArtist(artistState.artist);
  }, [])

  const getArtistProfile = async () => {
    setIsLoading(true);
    const artist = await fetchArtist();
    artistActions.artistStateChanged(artist);
    setArtist(artist);
    setIsLoading(false);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const artistForm = e.currentTarget;
    if (artistForm.checkValidity() === false) {
      e.preventDefault();
      e.stopPropagation();
      setValidated(true);
    } else {
      setIsLoading(true);
      const data = new FormData(form.current);
      data.delete('cover_image');
      data.delete('banner_image');
      data.delete('additional_images');
      if(image) {
        // append images
      }
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
        alert('Something went wrong, try later!');
      } else {
        setArtist(artist);
        artistActions.artistStateChanged(artist);
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
    }
  }

  const handleFileChange = (e) => {
    setImage(e.target.files[0]);
  }

  return (
    <div className="artist-wrapper">
      <section className="artist-section-control">
        <div className="section-content">
          <div className="section-head">
            <h2>Profile edit</h2>
          </div>
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
              </Row>
              <Row>
                <Col xl={2} md={6}>
                  <Form.Label>Cover Image</Form.Label>
                </Col>
                <Col xl={4} md={6}>
                  <Form.File
                    accept=".png, .jpg, .svg"
                    onChange={handleFileChange}
                    name="cover_image"
                    label={image ? image.name : ''}
                    lang="en"
                    custom
                  />
                </Col>
              </Row>
              <Row>
                <Col xl={2} md={6}>
                  <Form.Label>Banner Image</Form.Label>
                </Col>
                <Col xl={4} md={6}>
                  <Form.File
                    accept=".png, .jpg, .svg"
                    onChange={handleFileChange}
                    name="banner_image"
                    label={image ? image.name : ''}
                    lang="en"
                    custom
                  />
                </Col>
              </Row>
              <Row>
                <Col xl={2} md={6}>
                  <Form.Label>Additional Images</Form.Label>
                </Col>
                <Col xl={4} md={6}>
                  <Form.File
                    accept=".png, .jpg, .svg"
                    onChange={handleFileChange}
                    name="additional_images"
                    label={image ? image.name : ''}
                    lang="en"
                    custom
                  />
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
              <h2 className="mt-5">Contact</h2>
              <hr/>
              <Row>
                <Col xl={2} md={6}>
                  <Form.Label>Address</Form.Label>
                </Col>
                <Col xl={4} md={6}>
                  <Form.Control
                    name="contact"
                    defaultValue={artist.contact}
                    placeholder="Enter contact info here"
                    as="textarea"
                    rows={4}
                  />
                </Col>
              </Row>
              <Row>
                <Col xl={2} md={6}></Col>
                <Col xl={4} md={6} className="text-center">
                  <NavLink to="/profile" className="btn primary-btn btn-outline-light mr-5 cancel">Cancel</NavLink>
                  <Button type="submit" className="btn primary-btn submit">{isLoading ? <>Saving...<img className="" src={Loader} alt="icon"/></> : "Save profile" }</Button>
                </Col>
              </Row>
            </Form>
          }
        </div>
      </section>
    </div>
  )
}

export default ProfileEdit;
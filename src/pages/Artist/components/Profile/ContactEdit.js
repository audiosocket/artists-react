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

function ContactEdit() {
  const {artistState, artistActions} = React.useContext(ArtistContext);
  const [isLoading, setIsLoading] = useState(false);
  const [artist, setArtist] = useState({});
  const history = useHistory();
  const form = useRef(null);
  const [validated, setValidated] = useState(false);

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

  return (
    <div className="artist-wrapper">
      <section className="artist-section-control">
        <div className="section-content">
          <div className="section-head">
            <h2>Edit Contact</h2>
          </div>
          {Object.keys(artist).length === 0 && isLoading && <h5>Loading profile... <img className="loading" src={Loader} alt="loading-icon"/></h5>}
          {Object.keys(artist).length !== 0 &&
            <Form noValidate validated={validated} ref={form} onSubmit={handleSubmit}>
              <Row>
                <Col xl={2} md={6}>
                  <Form.Label>Name</Form.Label>
                </Col>
                <Col xl={4} md={6}>
                  <Form.Control
                    required
                    name="contact_information[name]"
                    type="text"
                    defaultValue={artist.contact_information ? artist.contact_information.name : ""}
                    placeholder="Name"
                  />
                  <Form.Control.Feedback type="invalid">
                    Name is required!
                  </Form.Control.Feedback>
                </Col>
              </Row>
              <Row>
                <Col xl={2} md={6}>
                  <Form.Label>Street</Form.Label>
                </Col>
                <Col xl={4} md={6}>
                  <Form.Control
                    required
                    name="contact_information[street]"
                    type="text"
                    defaultValue={artist.contact_information ? artist.contact_information.street : ""}
                    placeholder="Street"
                  />
                  <Form.Control.Feedback type="invalid">
                    Street is required!
                  </Form.Control.Feedback>
                </Col>
              </Row>
              <Row>
                <Col xl={2} md={6}>
                  <Form.Label>Postal Code</Form.Label>
                </Col>
                <Col xl={4} md={6}>
                  <Form.Control
                    required
                    name="contact_information[postal_code]"
                    type="text"
                    defaultValue={artist.contact_information ? artist.contact_information.postal_code : ""}
                    placeholder="Postal Code"
                  />
                  <Form.Control.Feedback type="invalid">
                    Postal code is required!
                  </Form.Control.Feedback>
                </Col>
              </Row>
              <Row>
                <Col xl={2} md={6}>
                  <Form.Label>City</Form.Label>
                </Col>
                <Col xl={4} md={6}>
                  <Form.Control
                    required
                    name="contact_information[city]"
                    type="text"
                    defaultValue={artist.contact_information ? artist.contact_information.city : ""}
                    placeholder="City"
                  />
                  <Form.Control.Feedback type="invalid">
                    City is required!
                  </Form.Control.Feedback>
                </Col>
              </Row>
              <Row>
                <Col xl={2} md={6}>
                  <Form.Label>State</Form.Label>
                </Col>
                <Col xl={4} md={6}>
                  <Form.Control
                    required
                    name="contact_information[state]"
                    type="text"
                    defaultValue={artist.contact_information ? artist.contact_information.state : ""}
                    placeholder="State"
                  />
                  <Form.Control.Feedback type="invalid">
                    State is required!
                  </Form.Control.Feedback>
                </Col>
              </Row>
              <Row>
                <Col xl={2} md={6}>
                  <Form.Label>Country</Form.Label>
                </Col>
                <Col xl={4} md={6}>
                  <Form.Control
                    required
                    name="contact_information[country]"
                    type="text"
                    defaultValue={artist.contact_information ? artist.contact_information.country : ""}
                    placeholder="Country"
                  />
                  <Form.Control.Feedback type="invalid">
                    Country is required!
                  </Form.Control.Feedback>
                </Col>
              </Row>
              <Row>
                <Col xl={2} md={6}></Col>
                <Col xl={4} md={6} className="text-center">
                  <NavLink to="/profile" className="btn primary-btn btn-outline-light mr-5 cancel">Cancel</NavLink>
                  <Button type="submit" className="btn primary-btn submit">{isLoading ? <>Saving...<img className="" src={Loader} alt="icon"/></> : "Save" }</Button>
                </Col>
              </Row>
            </Form>
          }
        </div>
      </section>
    </div>
  )
}

export default ContactEdit;
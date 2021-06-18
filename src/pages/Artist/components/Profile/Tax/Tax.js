import React, {useEffect, useRef, useState} from "react";
import "./../Profile.scss";
import {ArtistContext} from "../../../../../Store/artistContext";
import fetchArtist from "../../../../../common/utlis/fetchArtist";
import Loader from "../../../../../images/loader.svg";
import {NavLink, useHistory} from "react-router-dom";
import Form from "react-bootstrap/Form";
import {Col, Row} from "react-bootstrap";
import Button from "react-bootstrap/Button";
import {ACCESS_TOKEN, ARTIST_PROFILE_UPDATE, BASE_URL} from "../../../../../common/api";
import Breadcrumb from "react-bootstrap/Breadcrumb";
import Notiflix from "notiflix-react";

function Tax() {
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
  }, [artistState.artist])

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
      const json = prepareJson(data);
      const userAuthToken = JSON.parse(localStorage.getItem("user") ?? "");
      const response = await fetch(`${BASE_URL}${ARTIST_PROFILE_UPDATE}`,
        {
          headers: {
            "authorization": ACCESS_TOKEN,
            "auth-token": userAuthToken,
            'content-type': 'application/json',
          },
          method: 'PATCH',
          body: json
        });
      const artist = await response.json();
      if(!response.ok) {
        Notiflix.Notify.Failure('Something went wrong, try later!');
      } else {
        setArtist(artist);
        artistActions.artistStateChanged(artist);
        Notiflix.Notify.Success('Tax information updated!');
        history.push('/profile');
      }
      setIsLoading(false);
    }
  }

  const prepareJson = (data) => {
    let object = {};
    data.forEach((value, key) => object[key] = value);
    object = {
      tax_information: object
    }
    let json = JSON.stringify(object);
    return json;
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
            Edit Tax
          </li>
        </Breadcrumb>
      </div>
      <section className="artist-section-control">
        <div className="section-content">
          <div className="section-head">
            <h2>Edit Tax</h2>
          </div>
          {Object.keys(artist).length === 0 && isLoading && <h5>Loading profile... <img className="loading" src={Loader} alt="loading-icon"/></h5>}
          {Object.keys(artist).length !== 0 &&
          <Form noValidate validated={validated} ref={form} onSubmit={handleSubmit}>
            <Row>
              <Col xl={2} md={6}>
                <Form.Label>ID/Social Security Number</Form.Label>
              </Col>
              <Col xl={4} md={6}>
                <Form.Control
                  required
                  name="ssn"
                  type="text"
                  defaultValue={artist.tax_information ? artist.tax_information.ssn : ""}
                  placeholder="ID/Social Security Number"
                />
                <Form.Control.Feedback type="invalid">
                  ID/Social Security Number is required!
                </Form.Control.Feedback>
              </Col>
            </Row>
            <Row>
              <Col xl={2} md={6}></Col>
              <Col xl={4} md={6} className="text-center mt-4">
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

export default Tax;
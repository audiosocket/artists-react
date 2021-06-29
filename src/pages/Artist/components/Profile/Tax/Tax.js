import React, {useEffect, useRef, useState} from "react";
import "./../Profile.scss";
import {ArtistContext} from "../../../../../Store/artistContext";
import Loader from "../../../../../images/loader.svg";
import {NavLink, useHistory} from "react-router-dom";
import Form from "react-bootstrap/Form";
import {Col, Row} from "react-bootstrap";
import Button from "react-bootstrap/Button";
import {
  ACCESS_TOKEN,
  ARTIST_PROFILE_UPDATE,
  BASE_URL,
  COLLABORATOR_ARTIST_PROFILE_UPDATE
} from "../../../../../common/api";
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
    if(artistState.artist) {
      setIsLoading(false);
      if(Object.keys(artistState.artist).length <= 1) {
        Notiflix.Report.Failure( 'Not accessible', `You don't have access to profile!`, 'Ok', () => {
          history.push("/");
        } );
      }
      if(form.current)
        form.current.reset();
      setArtist(artistState.artist);
    } else
      setIsLoading(true);
  }, [artistState.artist])

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
      const userRole = artistState.userRole || JSON.parse(localStorage.getItem("userRole") ?? "");
      let artist_id =  userRole === "collaborator" && artistState.selectedArtist && artistState.selectedArtist.id;
      let url = `${BASE_URL}${ARTIST_PROFILE_UPDATE}`;
      if(userRole === "collaborator") {
        artist_id = artistState.selectedArtist && artistState.selectedArtist.id;
        url = `${BASE_URL}${COLLABORATOR_ARTIST_PROFILE_UPDATE}?artist_id=${artist_id}`
      }
      const userAuthToken = JSON.parse(localStorage.getItem("user") ?? "");
      const response = await fetch(url,
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
              <Col xl={2} md={4}>
                <Form.Label>Please add Tax ID/SSN*</Form.Label>
              </Col>
              <Col xl={4} md={8}>
                <Form.Control
                  required
                  name="ssn"
                  type="text"
                  defaultValue={artist.tax_information ? artist.tax_information.ssn : ""}
                  placeholder="Please add Tax ID/SSN"
                />
                <small><i>For US artists only</i></small>
                <Form.Control.Feedback type="invalid">
                  ID/Social Security Number is required!
                </Form.Control.Feedback>
              </Col>
            </Row>
            <Row className="mt-5">
              <Col xl={2} md={0}></Col>
              <Col xl={4} md={12} className="text-center">
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
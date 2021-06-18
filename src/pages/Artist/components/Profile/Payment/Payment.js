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

function Payment() {
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
        Notiflix.Notify.Success('Payment information updated!');
        history.push('/profile');
      }
      setIsLoading(false);
    }
  }

  const prepareJson = (data) => {
    let object = {};
    data.forEach((value, key) => object[key] = value);
    object = {
      payment_information: object
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
            Edit Payment
          </li>
        </Breadcrumb>
      </div>
      <section className="artist-section-control">
        <div className="section-content">
          <div className="section-head">
            <h2>Edit Payment</h2>
          </div>
          {Object.keys(artist).length === 0 && isLoading && <h5>Loading profile... <img className="loading" src={Loader} alt="loading-icon"/></h5>}
          {Object.keys(artist).length !== 0 &&
          <Form noValidate validated={validated} ref={form} onSubmit={handleSubmit}>
            <Row>
              <Col xl={2} md={6}>
                <Form.Label>Payee Name</Form.Label>
              </Col>
              <Col xl={4} md={6}>
                <Form.Control
                  required
                  name="payee_name"
                  type="text"
                  defaultValue={artist.payment_information ? artist.payment_information.payee_name : ""}
                  placeholder="Payee name"
                />
                <Form.Control.Feedback type="invalid">
                  Payee Name is required!
                </Form.Control.Feedback>
              </Col>
            </Row>
            <Row>
              <Col xl={2} md={6}>
                <Form.Label>Bank Name</Form.Label>
              </Col>
              <Col xl={4} md={6}>
                <Form.Control
                  required
                  name="bank_name"
                  type="text"
                  defaultValue={artist.payment_information ? artist.payment_information.bank_name : ""}
                  placeholder="Bank name"
                />
                <Form.Control.Feedback type="invalid">
                  Bank name is required!
                </Form.Control.Feedback>
              </Col>
            </Row>
            <Row>
              <Col xl={2} md={6}>
                <Form.Label>Routing</Form.Label>
              </Col>
              <Col xl={4} md={6}>
                <Form.Control
                  required
                  name="routing"
                  type="text"
                  defaultValue={artist.payment_information ? artist.payment_information.routing : ""}
                  placeholder="Routing"
                />
                <Form.Control.Feedback type="invalid">
                  Routing is required!
                </Form.Control.Feedback>
              </Col>
            </Row>
            <Row>
              <Col xl={2} md={6}>
                <Form.Label>Account Number</Form.Label>
              </Col>
              <Col xl={4} md={6}>
                <Form.Control
                  required
                  name="account_number"
                  type="text"
                  defaultValue={artist.payment_information ? artist.payment_information.account_number : ""}
                  placeholder="Account number"
                />
                <Form.Control.Feedback type="invalid">
                  Account number is required!
                </Form.Control.Feedback>
              </Col>
            </Row>
            {artist.contact_information && artist.contact_information.country.toLowerCase() !== 'united states' &&
              <Row>
                <Col xl={2} md={6}>
                  <Form.Label>Paypal Email</Form.Label>
                </Col>
                <Col xl={4} md={6}>
                  <Form.Control
                    required
                    name="paypal_email"
                    type="email"
                    defaultValue={artist.payment_information ? artist.payment_information.paypal_email : ""}
                    placeholder="Paypam email"
                  />
                  <Form.Control.Feedback type="invalid">
                    Paypal email is required!
                  </Form.Control.Feedback>
                </Col>
              </Row>
            }
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

export default Payment;
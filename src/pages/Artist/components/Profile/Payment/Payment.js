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
import Notiflix from "notiflix";

function Payment() {
  const {artistState, artistActions} = React.useContext(ArtistContext);
  const [isLoading, setIsLoading] = useState(false);
  const [artist, setArtist] = useState({});
  const history = useHistory();
  const form = useRef(null);
  const [validated, setValidated] = useState(false);
  const [accountLimitFlag, setAccountLimitFlag] = useState(false);
  const [routingLimitFlag, setRoutingLimitFlag] = useState(false);

  useEffect(() => {
    if(artistState.artist) {
      if(!artistState.artist.country) {
        Notiflix.Report.warning('Action required', 'Please complete your profile first!', 'Update Profile', () => {
          history.push('/profile/edit')
        });
      }
      setIsLoading(false);
      if(Object.keys(artistState.artist).length <= 1) {
        Notiflix.Report.failure( 'Not accessible', `You don't have access to profile!`, 'Ok', () => {
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
      const data = new FormData(form.current);
      let error = false;
      if(data.get('routing') && !handleRoutingCharacterLimit(data.get('routing')))
        error = true;
      if(error)
        return false;
      setIsLoading(true);
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
        Notiflix.Notify.failure('Something went wrong, try later!', {
          timeout: 6000000,
          clickToClose: true,
        });
      } else {
        setArtist(artist);
        artistActions.artistStateChanged(artist);
        Notiflix.Notify.success('Payment information updated!');
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

  const handleRoutingCharacterLimit = (value) => {
    setRoutingLimitFlag(false);
    if(value.length === 9) {
      setRoutingLimitFlag(false);
      return true;
    } else if(form?.current?.elements?.paypal_email.value != '') {
      setRoutingLimitFlag(false); 
      return false;
    } else {
      setRoutingLimitFlag(true);
      return false;
    }
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
          <Row>
            <Col xl={6} md={12}>
              <div className="bg-content yellow bgSecondVersion mt-4">
                <p>Please enter your US bank details if you're based in the USA, we offer payment via ACH/Direct Deposit.</p>
                <p>If you're based internationally, please provide your PayPal address or your TransferWise bank details.</p>
              </div>
            </Col>
          </Row>
          <div className="section-head">
            <h2>Edit Payment</h2>
          </div>
          {Object.keys(artist).length === 0 && isLoading && <h5>Loading profile... <img className="loading" src={Loader} alt="loading-icon"/></h5>}
          {Object.keys(artist).length !== 0 &&
          <Form noValidate validated={validated} ref={form} onSubmit={handleSubmit}>
            {artist?.contact_information?.country && artist?.contact_information?.country?.toLowerCase() === 'us' &&
              <>
              <Row>
                <Col xl={2} md={4}>
                  <Form.Label>Payee Name*</Form.Label>
                </Col>
                <Col xl={4} md={8}>
                  <Form.Control
                    required={form?.current?.elements?.paypal_email.value === '' ? true : false}
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
                <Col xl={2} md={4}>
                  <Form.Label>Bank Name*</Form.Label>
                </Col>
                <Col xl={4} md={8}>
                  <Form.Control
                    required={form?.current?.elements?.paypal_email.value === '' ? true : false}
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
                <Col xl={2} md={4}>
                  <Form.Label>Routing*</Form.Label>
                </Col>
                <Col xl={4} md={8}>
                  <Form.Control
                    required={form?.current?.elements?.paypal_email.value === '' ? true : false}
                    name="routing"
                    type="number"
                    defaultValue={artist.payment_information ? artist.payment_information.routing : ""}
                    placeholder="Routing"
                    className={routingLimitFlag ? "invalid" : ""}
                    onChange={(e) => handleRoutingCharacterLimit(e.target.value)}
                  />
                  <Form.Control.Feedback type="invalid">
                    Routing is required!
                  </Form.Control.Feedback>
                  {routingLimitFlag && <div className="custom-invalid-feedback">Routing must be 9 digits</div>}
                </Col>
              </Row>
              <Row>
                <Col xl={2} md={4}>
                  <Form.Label>Account Number*</Form.Label>
                </Col>
                <Col xl={4} md={8}>
                  <Form.Control
                    required={form?.current?.elements?.paypal_email.value === '' ? true : false}
                    name="account_number"
                    min={14}
                    type="text"
                    defaultValue={artist.payment_information ? artist.payment_information.account_number : ""}
                    placeholder="Account number"
                  />
                  <Form.Control.Feedback type="invalid">
                    Account number is required!
                  </Form.Control.Feedback>
                  {accountLimitFlag && <div className="custom-invalid-feedback">Account number must be 10 digits</div>}
                </Col>
              </Row>
              <Row></Row>
              <Row>
                <Col xl={2} md={4}>
                  <Form.Label>Paypal Email*</Form.Label>
                </Col>
                <Col xl={4} md={8}>
                  <Form.Control
                    required={form?.current?.elements?.account_number.value === '' || form?.current?.elements?.bank_name.value === '' || form?.current?.elements?.payee_name.value === '' || form?.current?.elements?.routing.value === '' ? true : false}
                    name="paypal_email"
                    type="email"
                    defaultValue={artist.payment_information ? artist.payment_information.paypal_email : ""}
                    placeholder="Paypal email"
                  />
                  <Form.Control.Feedback type="invalid">
                    Paypal email is required!
                  </Form.Control.Feedback>
                </Col>
              </Row>
              </>
            }
            {artist.contact_information.country && artist.contact_information.country.toLowerCase() !== 'us' &&
              <>
              <Row>
                <Col xl={2} md={4}>
                  <Form.Label>Payee Name*</Form.Label>
                </Col>
                <Col xl={4} md={8}>
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
                <Col xl={2} md={4}>
                  <Form.Label>Paypal Email*</Form.Label>
                </Col>
                <Col xl={4} md={8}>
                  <Form.Control
                    required
                    name="paypal_email"
                    type="email"
                    defaultValue={artist.payment_information ? artist.payment_information.paypal_email : ""}
                    placeholder="Paypal email"
                  />
                  <Form.Control.Feedback type="invalid">
                    Paypal email is required!
                  </Form.Control.Feedback>
                </Col>
              </Row>
              </>
            }
            <Row className="mt-5">
              <Col xl={2} md={0}></Col>
              <Col xl={4} md={12} className="text-center mt-4">
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
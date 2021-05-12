import React, {useEffect, useRef, useState} from "react";
import "./Signup.scss";
import Logo from '../../images/logo-black.svg';
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Loader from "../../images/loader.svg";
import ArrowRight from "../../images/right-arrow.svg";
import {AuthContext} from "../../Store/authContext";
import {useHistory} from "react-router-dom";
import {ACCEPT_INVITATION, ACCESS_TOKEN, AUTHENTICATE_TOKEN, BASE_URL, SESSION} from "../../common/api";
import {Col, Row} from "react-bootstrap";
import Download from "../../images/file.svg";
import Check from "../../images/check.svg";
import Cancel from "../../images/cancel.svg";

function Signup({userHash = ''}) {
  const { authActions } = React.useContext(AuthContext);
  const history = useHistory();
  const form = useRef(null);
  const [validated, setValidated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isConfirmError, setIsConfirmError] = useState(false);
  const [isPasswordUpdated, setIsPasswordUpdated] = useState(false);
  const [isAgreementStep, setIsAgreementStep] = useState(false);

  useEffect(() => {
    verifyHash();
  }, [])

  const verifyHash = async () => {
    setIsLoading(true);
    let is_valid = true;
    if(!userHash)
      is_valid = false;

    if(is_valid) {
      const response = await fetch(`${BASE_URL}${AUTHENTICATE_TOKEN}?token=${userHash}`,
        {
          headers: {
            "authorization": ACCESS_TOKEN,
          }
        });
      if(response.status !== 200)
        is_valid = false;

      if (is_valid) {
        const res = await response.json();
        setIsPasswordUpdated(res.password);
        if(res.password) {
          setIsAgreementStep(res.agreements);
        }
      }
    }
    if(!is_valid) {
      setIsLoading(false);
      alert("Invitation link is broken or not valid");
      //history.push('/login');
    }
    setIsLoading(false);
    return true;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const auditionForm = e.currentTarget;
    if (auditionForm.checkValidity() === false) {
      e.preventDefault();
      e.stopPropagation();
      setValidated(true);
      setIsLoading(false);
    } else {
      const data = new FormData(form.current);
      if(data.get('password') !== data.get('password_confirmation')) {
        setIsConfirmError(true);
        setIsLoading(false);
        return;
      }
      data.append('token', userHash);
      const response = await fetch(`${BASE_URL}${ACCEPT_INVITATION}`,
        {
          headers: {
            "authorization": ACCESS_TOKEN,
          },
          method: 'PATCH',
          body: data
        });
      const resultSet = await response.json();
      setIsLoading(false);
      if(response.status === 200) {
        alert('password updated')
        setIsAgreementStep(true);
        setIsPasswordUpdated(true);
        //authActions.userDataStateChanged(resultSet["auth_token"]);
        e.target.reset();
      } else {
        alert("Something went wrong, try later!");
      }
      setIsLoading(false);
    }
  }

  const handleConfirmPassword = () => {
    const data = new FormData(form.current);
    if(data.get('password') !== data.get('password_confirmation'))
      setIsConfirmError(true);
    else
      setIsConfirmError(false);
  }

  const handleSubmitReviewAgreement = (e) => {
    e.preventDefault();
    if(e.target.dataset.action === "true") {
      alert("Invitation sign up completed")
      authActions.userDataStateChanged('email');
      history.push("/");
    } else {
      alert("Invitation rejected")
      history.push("/login");
    }
  }

  return (
    <div className="login-block">
      <div className="login-logo">
        <img className="" src={Logo} alt="Workflow" onClick={() => {history.push("/")}} />
      </div>
      <h2 className="">{!isAgreementStep ? "Create a password to proceed" : "Review Agreement"}</h2>
      {!isPasswordUpdated && !isAgreementStep
        ?
          <Form className="form" noValidate validated={validated} ref={form} onSubmit={handleSubmit}>
            <Form.Group controlId="formBasicPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control onChange={handleConfirmPassword} required type="password" name="password" placeholder="Password"/>
              <Form.Control.Feedback type="invalid">
                This field is required!
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className={isConfirmError && 'invalid'} controlId="formBasicPasswordConfirm">
              <Form.Label>Confirm Password</Form.Label>
              <Form.Control onChange={handleConfirmPassword} required type="password" name="password_confirmation"
                            placeholder="Confirm Password"/>
              {!isConfirmError &&
              <Form.Control.Feedback type="invalid">
                This field is required!
              </Form.Control.Feedback>
              }
              {isConfirmError &&
              <small className="invalid">
                Passwords don't match
              </small>
              }
            </Form.Group>
            <Button disabled={isLoading} variant="btn primary-btn btn-full-width" type="submit">
              Proceed
              <img className="" src={isLoading ? Loader : ArrowRight} alt="proceed-icon"/>
            </Button>
          </Form>
        :
          <div className="form agreement">
            <Form.Group>
              <div className="agreement-container">
                <h3>What is Lorem Ipsum?</h3>
                Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
                <br/>
                <br/>
                <h3>Why do we use it?</h3>
                It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).
                <br/>
                <br/>
                <h3>Where does it come from?</h3>
                Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in classical literature, discovered the undoubtable source. Lorem Ipsum comes from sections 1.10.32 and 1.10.33 of "de Finibus Bonorum et Malorum" (The Extremes of Good and Evil) by Cicero, written in 45 BC. This book is a treatise on the theory of ethics, very popular during the Renaissance. The first line of Lorem Ipsum, "Lorem ipsum dolor sit amet..", comes from a line in section 1.10.32.
              </div>
            </Form.Group>
            <Form.Group>
              <a href='http://www.africau.edu/images/default/sample.pdf' target="_blank" rel="noopener noreferrer" download>
                <Button variant="btn primary-btn btn-full-width download">
                  <img className="" src={Download} alt="download-btn"/>
                  Download agreement as pdf
                </Button>
              </a>
            </Form.Group>
            <Row>
              <Col xs={6}>
                <Button onClick={handleSubmitReviewAgreement} data-action={false} variant="btn primary-btn reject btn-full-width">
                  <img className="" src={Cancel} alt="download-btn"/>
                  Reject
                </Button>
              </Col>
              <Col xs={6}>
                <Button onClick={handleSubmitReviewAgreement} data-action={true} variant="btn primary-btn accept btn-full-width">
                  <img className="" src={Check} alt="download-btn"/>
                  Accept
                </Button>
              </Col>
            </Row>
          </div>
      }
    </div>
  );
}

export default Signup;

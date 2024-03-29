import React, {useEffect, useRef, useState} from "react";
import "./Signup.scss";
import Logo from '../../images/logo-black.svg';
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Loader from "../../images/loader.svg";
import ArrowRight from "../../images/right-arrow.svg";
import {AuthContext} from "../../Store/authContext";
import {useHistory, useLocation} from "react-router-dom";
import {
  ACCEPT_INVITATION,
  ACCESS_TOKEN,
  AUTHENTICATE_TOKEN,
  BASE_URL,
  AGREEMENTS, AUTHENTICATE_COLLABORATOR_TOKEN,
} from "../../common/api";
import {Col, Row} from "react-bootstrap";
import Download from "../../images/file.svg";
import Check from "../../images/check.svg";
import Cancel from "../../images/cancel.svg";
import FAQs from "../../images/pdf.svg";
import fetchAgreements from "../../common/utlis/fetchAgreements";
import Notiflix from "notiflix";
import AgreementFAQS from "../../agreement-faqs.pdf"

function Signup({userHash = ''}) {
  const pathname = useLocation().pathname;
  const { authActions } = React.useContext(AuthContext);
  const history = useHistory();
  const form = useRef(null);
  const [validated, setValidated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isConfirmError, setIsConfirmError] = useState(false);
  const [isPasswordUpdated, setIsPasswordUpdated] = useState(false);
  const [isAgreementStep, setIsAgreementStep] = useState(false);
  const [agreements, setAgreements] = useState([]);
  const [isCollaborator, setIsCollaborator] = useState(false);
  const [collaboratorToken, setCollaboratorToken] = useState(null);

  useEffect(() => {
    verifyHash();
  }, [])

  useEffect(() => {
    if(isPasswordUpdated) {
      //fetchAgreements()
    }
  }, [isPasswordUpdated])

  const verifyHash = async () => {
    setIsLoading(true);
    let url = `${BASE_URL}${AUTHENTICATE_TOKEN}`;
    let isCollaborator = false;
    if(pathname.split('/')[1] === 'accept-collaborator-invitation') {
      url = `${BASE_URL}${AUTHENTICATE_COLLABORATOR_TOKEN}`;
      setIsCollaborator(true);
      isCollaborator = true;
    }
    let is_valid = true;
    if(!userHash)
      is_valid = false;

    if(is_valid) {
      const response = await fetch(`${url}?token=${userHash}`,
        {
          headers: {
            "authorization": ACCESS_TOKEN,
          }
        });
      if(!response.ok)
        is_valid = false;

      if (is_valid) {
        const res = await response.json();

        if(res.password) {
          const userAuthToken = JSON.parse(localStorage.getItem("user"));
          if(userAuthToken) {
            const result = await fetchAgreements(isCollaborator ? 'collaborator' : 'artist');
            setAgreements(result)
            setIsAgreementStep(true);
            setIsPasswordUpdated(res.password);
          } else {
            Notiflix.Report.failure('Error', `This link has expired. Please contact artists@audiosocket.com for a new link.`, 'Ok', () => {
              history.push('/login')
            } );
          }
        }
        if(isCollaborator) {
          if(res.meta.password) {
            const userAuthToken = JSON.parse(localStorage.getItem("user"));
            if(userAuthToken) {
              const result = await fetchAgreements(isCollaborator ? 'collaborator' : 'artist');
              setAgreements(result);
              setIsAgreementStep(true);
              setIsPasswordUpdated(res.meta.password);
            } else {
              Notiflix.Report.success( 'Success', `Password already set, login to proceed!`, 'Login', () => {
                history.push('/login')
              } );
            }
          }
          setCollaboratorToken(res.meta.token);
        }
      }
    }
    if(!is_valid) {
      let userAuthToken = '';
      if(localStorage.getItem("user")) {
        userAuthToken = JSON.parse(localStorage.getItem("user") ?? "");
      }
      if(userAuthToken) {
        const res = await fetchAgreements(isCollaborator ? 'collaborator' : 'artist');
        const pending = res.filter(agreement => agreement.status === "pending")
        if(pending.length) {
          setAgreements(pending)
          setIsAgreementStep(true);
          setIsPasswordUpdated(true);
        } else {
          history.push('/');
        }
      } else {
        Notiflix.Report.failure('Error', `This link has expired. Please contact artists@audiosocket.com for a new link.`, 'Ok', () => {
          history.push('/login')
        } );
      }
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
      data.append('token', isCollaborator ? collaboratorToken : userHash);
      if(isCollaborator)
        data.append('role', 'collaborator');
      else
        data.append('role', 'artist');
      const response = await fetch(`${BASE_URL}${ACCEPT_INVITATION}`,
        {
          headers: {
            "authorization": ACCESS_TOKEN,
          },
          method: 'PATCH',
          body: data
        });
      if(response.ok) {
        Notiflix.Notify.success('Password updated successfully!');
        const resultSet = await response.json();
        authActions.userDataStateChanged(resultSet["auth_token"]);
        localStorage.setItem("userRole", JSON.stringify(isCollaborator ? 'collaborator' : 'artist'));
        setIsAgreementStep(true);
        setIsPasswordUpdated(true);
        const res = await fetchAgreements(isCollaborator ? 'collaborator' : 'artist');
        const pending = res.filter(agreement => agreement.status === "pending");
        setAgreements(pending);
        if(pending.length === 0) {
          Notiflix.Report.success( 'Success', `Invitation process completed`, 'Ok', () => {
            history.push('/')
          } );
        }
        e.target.reset();
      } else {
        if(response.status === 401) {
          Notiflix.Report.failure( 'Error', `Link expired, contact support or login to proceed.`, 'Ok', () => {
            history.push('/login')
          } );
        } else
          Notiflix.Notify.failure('Something went wrong, try again!', {
            timeout: 6000000,
            clickToClose: true,
          });
      }
      setIsLoading(false);
    }
  }

  const handleConfirmPassword = () => {
    const data = new FormData(form.current);
    if(!data.get('password_confirmation')) {
      setIsConfirmError(false);
      return;
    }
    if(data.get('password') !== data.get('password_confirmation'))
      setIsConfirmError(true);
    else
      setIsConfirmError(false);
  }

  const handleSubmitReviewAgreement = async (e) => {
    e.preventDefault();
    const userAuthToken = JSON.parse(localStorage.getItem("user") ?? "");
    const action = e.target.dataset.action;
    const agreement_id = e.target.dataset.id;
    const response = await fetch(`${BASE_URL}${AGREEMENTS}/${agreement_id}/update_status?status=${action}`,
      {
        headers: {
          "authorization": ACCESS_TOKEN,
          "auth-token": userAuthToken
        },
        method: 'PATCH',
      });
    if(!response.ok) {
      Notiflix.Notify.failure('Something went wrong, try later!', {
        timeout: 6000000,
        clickToClose: true,
      });
    } else {
      Notiflix.Notify.success('Agreements updated successfully!');
      const resultSet = await response.json();
      const pending = resultSet.filter(agreement => agreement.status === "pending");
      setAgreements(pending);
      if(!pending.length) {
        Notiflix.Report.success( 'Success', `Invitation process completed`, 'Ok', () => {
          history.push('/')
        } );
      }
    }
  }

  return (
    <div className="login-block">
      <div className="login-logo">
        <img className="" src={Logo} alt="Workflow" onClick={() => {
          localStorage.removeItem("user");
          localStorage.removeItem("userRole");
          history.push("/login");
        }} />
      </div>
      <h2 className="">{!isAgreementStep ? "Create a password to proceed" : "Review Agreements"}</h2>
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
            <h5 className="text-center">You must accept/reject agreement(s) to proceed to artist portal!</h5>
            {agreements.length !== 0 &&
              agreements.map((agreement, key) => {
                return (
                <div key={key} className={agreement.status === "pending" ? "agreement-form-container" : "agreement-form-container hide"}>
                  <h3 className="agreement-type">{agreement.agreement.agreement_type.replace("_", " ")} Agreement</h3>
                  <Form.Group>
                    <div className="agreement-container" dangerouslySetInnerHTML={{__html: agreement.agreement.content}} />
                  </Form.Group>
                  <Form.Group>
                    <a href={agreement.agreement.file} target="_blank" rel="noopener noreferrer" download>
                      <Button variant="btn primary-btn btn-full-width download">
                        <img className="" src={Download} alt="download-btn"/>
                        Download agreement as pdf
                      </Button>
                    </a>
                  </Form.Group>
                  <Row>
                    <Col xs={6}>
                      <a href={AgreementFAQS} rel="noopener noreferrer" target="_blank">
                        <Button data-id={agreement.id} data-action={"rejected"}
                                variant="btn primary-btn faqs btn-full-width">
                          <img className="" src={FAQs} alt="download-btn"/>
                          FAQs
                        </Button>
                      </a>
                    </Col>
                    <Col xs={6}>
                      <Button onClick={handleSubmitReviewAgreement} data-id={agreement.id} data-action={"accepted"}
                              variant="btn primary-btn accept btn-full-width">
                        <img className="" src={Check} alt="download-btn"/>
                        Accept
                      </Button>
                    </Col>
                  </Row>
                </div>
                );
              })
            }
          </div>
      }
    </div>
  );
}

export default Signup;

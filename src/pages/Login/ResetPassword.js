import React, {useEffect, useRef, useState} from "react";
import {NavLink, useHistory} from "react-router-dom";
import "./Login.scss";
import Logo from '../../images/logo-black.svg';
import ResetPasswordIcon from '../../images/reset-password.svg';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import {ACCESS_TOKEN, BASE_URL, RESET_PASSWORD} from "../../common/api";
import Loader from "./../../images/loader.svg"
import Back from "../../images/back.svg";

function ResetPassword({userHash = ''}) {
  const history = useHistory();
  const form = useRef(null);
  const [validated, setValidated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [responseMessage, setResponseMessage] = useState('');
  const [isConfirmError, setIsConfirmError] = useState(false);

  useEffect(() => {
    if(localStorage.getItem('user')) {
      alert('Already logged in');
      history.push('/');
    }
    if(!userHash) {
      alert("Token expired or not valid!")
      history.push("/login");
    }
  }, [])

  const handleSubmit = async (e) => {
    setResponseMessage('');
    e.preventDefault();
    const forgotPasswordForm = e.currentTarget;
    if (forgotPasswordForm.checkValidity() === false) {
      e.preventDefault();
      e.stopPropagation();
      setValidated(true);
    } else {
      setIsLoading(true);
      const data = new FormData(form.current);
      data.append('reset_password_token', userHash);
      const response = await fetch(`${BASE_URL}${RESET_PASSWORD}`,
        {
          headers: {
            "authorization": ACCESS_TOKEN,
          },
          method: 'PATCH',
          body: data
        });
      if(response.ok) {
        e.target.reset();
        setResponseMessage('success');
      } else {
        setResponseMessage('error');
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

  return (
    <div className="login-block">
      <div className="login-logo">
        <img className="" src={Logo} alt="Workflow" onClick={() => {history.push("/")}} />
      </div>
      <h2 className="">Reset your password</h2>
      {responseMessage === 'error'
        ? <p className="login-error">Link broken or not valid!</p>
        : responseMessage === 'success' ? <h4 className="mb-4 success">Password updated, login to proceed!</h4> : ''
      }
      <Form className="form" noValidate validated={validated} ref={form} onSubmit={handleSubmit}>
        {responseMessage !== 'success' &&
          <>
            <Form.Group controlId="formBasicPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control onChange={handleConfirmPassword} required type="password" name="password" placeholder="Password"/>
              <Form.Control.Feedback type="invalid">
                This field is required!
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className={isConfirmError && 'invalid'} controlId="formBasicPasswordConfirm">
              <Form.Label>Confirm Password</Form.Label>
              <Form.Control onChange={handleConfirmPassword} required type="password" name="password_confirmation" placeholder="Confirm Password"/>
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
          </>
        }
        <div className="block-inline remember-text">
          <div className="text-sm">
            <NavLink to={"/login"}>
              <img className="back" src={Back} alt="Workflow"/>Back to login
            </NavLink>
          </div>
        </div>
        <Button disabled={isLoading} variant="btn primary-btn btn-full-width" type="submit">
          Reset
          <img className="" src={isLoading ? Loader : ResetPasswordIcon} alt="proceed-icon"/>
        </Button>
      </Form>
    </div>
  );
}

export default ResetPassword;

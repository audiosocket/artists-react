import React, {useEffect, useRef, useState} from "react";
import {NavLink, useHistory} from "react-router-dom";
import "./Login.scss";
import Logo from '../../images/logo-black.svg';
import ResetPasswordIcon from '../../images/reset-password.svg';
import Back from '../../images/back.svg';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import {ACCESS_TOKEN, BASE_URL, FORGOT_PASSWORD} from "../../common/api";
import Loader from "./../../images/loader.svg"

function ForgotPassword() {
  const history = useHistory();
  const form = useRef(null);
  const [validated, setValidated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [responseMessage, setResponseMessage] = useState('');

  useEffect(() => {
    if(localStorage.getItem('user')) {
      alert('Already logged in');
      history.push('/');
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
      data.append('role', 'artist');
      const response = await fetch(`${BASE_URL}${FORGOT_PASSWORD}`,
        {
          headers: {
            "authorization": ACCESS_TOKEN,
          },
          method: "POST",
          body: data
        });
      if(response.ok) {
        setResponseMessage("success");
        e.target.reset();
      } else {
        setResponseMessage("error");
      }
      setIsLoading(false);
    }
  }

  return (
    <div className="login-block">
      <div className="login-logo">
        <img className="" src={Logo} alt="Workflow" onClick={() => {history.push("/")}} />
      </div>
      <h2 className="">Get a link to reset your password on your email</h2>
      {responseMessage === 'error'
        ? <p className="login-error">User doesn't exist!</p>
        : responseMessage === 'success' ? <h4 className="mb-4">Password reset link sent to your email address!</h4> : ''
      }
      <Form className="form" noValidate validated={validated} ref={form} onSubmit={handleSubmit}>
        <Form.Group controlId="formBasicEmail">
          <Form.Label>Email address</Form.Label>
          <Form.Control required type="email" name="email" placeholder="Enter address" className="form-control"/>
          <Form.Control.Feedback type="invalid">
            A valid email address is required!
          </Form.Control.Feedback>
        </Form.Group>
        <div className="block-inline remember-text">
          <div className="text-sm">
            <NavLink to={"/login"}>
              <img className="back" src={Back} alt="Workflow"/>Back to login
            </NavLink>
          </div>
        </div>
        <Button disabled={isLoading} variant="btn primary-btn btn-full-width" type="submit"><img className="" src={isLoading ? Loader : ResetPasswordIcon} alt="Workflow"/>
          Submit
        </Button>
      </Form>
    </div>
  );
}

export default ForgotPassword;

import React, {useEffect, useRef, useState} from "react";
import {useHistory} from "react-router-dom";
import "./Login.scss";
import Logo from '../../images/logo-black.svg';
import ResetPassword from '../../images/reset-password.svg';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { AuthContext } from "../../Store/authContext";
import {ACCESS_TOKEN, BASE_URL, SESSION} from "../../common/api";
import Loader from "./../../images/loader.svg"

function ForgotPassword() {
  const history = useHistory();
  const form = useRef(null);
  const [validated, setValidated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState(false);

  useEffect(() => {
    if(localStorage.getItem('user')) {
      alert('Already logged in');
      history.push('/');
    }
  }, [])

  const handleSubmit = async (e) => {
    setLoginError(false);
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
      const response = await fetch(`${BASE_URL}${SESSION}`,
        {
          headers: {
            "authorization": ACCESS_TOKEN,
          },
          method: 'POST',
          body: data
        });
      if(response.ok) {
        history.push("/login");
        e.target.reset();
      } else {
        setLoginError(true);
      }
      setIsLoading(false);
    }
  }

  return (
    <div className="login-block">
      <div className="login-logo">
        <img className="" src={Logo} alt="Workflow" onClick={() => {history.push("/")}} />
      </div>
      <h2 className="">Reset your password</h2>
      {loginError &&
      <p className="login-error">Invalid email/password, try again!</p>
      }
      <Form className="form" noValidate validated={validated} ref={form} onSubmit={handleSubmit}>
        <Form.Group controlId="formBasicEmail">
          <Form.Label>Email address</Form.Label>
          <Form.Control required type="email" name="email" placeholder="Enter address" className="form-control" />
          <Form.Control.Feedback type="invalid">
            A valid email address is required!
          </Form.Control.Feedback>
        </Form.Group>

        <Button disabled={isLoading} variant="btn primary-btn btn-full-width" className="mt-4" type="submit"><img className="" src={isLoading ? Loader : ResetPassword} alt="Workflow"/>
          Reset
        </Button>
      </Form>
    </div>
  );
}

export default ForgotPassword;

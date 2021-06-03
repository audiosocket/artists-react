import React, {useEffect, useRef, useState} from "react";
import {useHistory} from "react-router-dom";
import "./Login.scss";
import Logo from '../../images/logo-black.svg';
import ResetPasswordIcon from '../../images/reset-password.svg';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import {ACCESS_TOKEN, BASE_URL, RESET_PASSWORD} from "../../common/api";
import Loader from "./../../images/loader.svg"
import {AuthContext} from "../../Store/authContext";

function ResetPassword({userHash = ''}) {
  const { authActions } = React.useContext(AuthContext);
  const history = useHistory();
  const form = useRef(null);
  const [validated, setValidated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState(false);
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
      data.append('reset_password_token', userHash);
      data.append('role', 'artist');
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
        const resultSet = await response.json();
        authActions.userDataStateChanged(resultSet["auth_token"]);
        alert("password updated")
        history.push("/");
      } else {
        setLoginError(true);
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
      {loginError &&
      <p className="login-error">Link broken or not valid!</p>
      }
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
          Reset
          <img className="" src={isLoading ? Loader : ResetPasswordIcon} alt="proceed-icon"/>
        </Button>
      </Form>
    </div>
  );
}

export default ResetPassword;

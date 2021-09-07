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
import Notiflix from "notiflix";

function ForgotPassword() {
  const history = useHistory();
  const form = useRef(null);
  const [validated, setValidated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if(localStorage.getItem('user')) {
      Notiflix.Confirm.Show(
        'Already Logged In',
        'Do you want to log out?',
        'Yes',
        'No',
        function(){
          localStorage.removeItem("user");
          localStorage.removeItem("userRole");
        },
        function(){
          history.push('/')
        }
      );
    }
  }, [])

  const handleSubmit = async (e) => {
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
        Notiflix.Report.Success( 'Success', `Password reset link sent to ${data.get('email')}!`, 'Ok', () => {
          history.push('/login')
        } );
        e.target.reset();
      } else {
        Notiflix.Report.Failure( 'Invalid user', `User "${data.get('email')}" doesn't exist, please enter a valid email address.`, 'Ok' );
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

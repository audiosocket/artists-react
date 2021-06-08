import React, {useEffect, useRef, useState} from "react";
import {NavLink, useHistory} from "react-router-dom";
import "./Login.scss";
import Logo from '../../images/logo-black.svg';
import Lock from '../../images/lock.svg';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { AuthContext } from "../../Store/authContext";
import {ACCESS_TOKEN, BASE_URL, SESSION} from "../../common/api";
import Loader from "./../../images/loader.svg"
import fetchAgreements from "../../common/utlis/fetchAgreements";

function Login() {
  const { authActions } = React.useContext(AuthContext);
  const history = useHistory();
  const form = useRef(null);
  const [validated, setValidated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState(false);
  const [rememberMe, setRemeberMe] = useState(false);

  useEffect(() => {
    if(localStorage.getItem('user')) {
      alert('Already logged in');
      history.push('/');
    }
  }, [])

  const handleSubmit = async (e) => {
    setLoginError(false);
    e.preventDefault();
    const loginForm = e.currentTarget;
    if (loginForm.checkValidity() === false) {
      e.preventDefault();
      e.stopPropagation();
      setValidated(true);
    } else {
      setIsLoading(true);
      const data = new FormData(form.current);

      if(!data.get('role'))
        data.append('role', 'artist');
      else
        data.set('role', 'collaborator')
      if(!data.get('remember_me'))
        data.append('remember_me', false)

      const response = await fetch(`${BASE_URL}${SESSION}`,
        {
          headers: {
            "authorization": ACCESS_TOKEN,
          },
          method: 'POST',
          body: data
        });
      const resultSet = await response.json();
      if(response.ok) {
        authActions.userDataStateChanged(resultSet["auth_token"]);
        const agreements = await fetchAgreements(resultSet["role"] ?? 'artist');
        const pending = agreements.filter(agreement => agreement.status === "pending").length
        const rejected = agreements.filter(agreement => agreement.status === "rejected").length
        if(rejected === agreements.length) {
          localStorage.removeItem("user");
          alert("Sorry, you can't proceed without accepting agreements.\nContact at artists@audiosocket.com for more details.");
          history.push("/login");
        }
        if(pending)
          history.push("/accept-invitation");
        else {
          localStorage.setItem("userRole", JSON.stringify(resultSet["role"]));
          history.push("/");
        }
        e.target.reset();
      } else {
        setLoginError(true);
      }
      setIsLoading(false);
    }
  }

  const handleRememberMe = (e) => {
    setRemeberMe(!rememberMe);
  }

  return (
    <div className="login-block">
      <div className="login-logo">
        <img className="" src={Logo} alt="Workflow" onClick={() => {history.push("/")}} />
      </div>
      <h2 className="">Sign in to your artist account</h2>
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

        <Form.Group controlId="formBasicPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control required type="password" name="password" placeholder="Password" />
          <Form.Control.Feedback type="invalid">
            This field is required!
          </Form.Control.Feedback>
        </Form.Group>
        <div className="block-inline remember-text">
          <Form.Check
            type="switch"
            id="custom-switch"
            name="role"
            label="Login as collaborator"
          />
        </div>
        <div className="block-inline remember-text">
          <div>
            <label htmlFor="remember_me" className="checkbox">
              <input onClick={handleRememberMe} value={rememberMe} id="remember_me" name="remember_me" type="checkbox" />
                Remember me
                <span className={rememberMe ? "checkmark checked" : "checkmark"}></span>
            </label>
          </div>
          <div className="text-sm">
            <NavLink to={"/forgot-password"}>
              Forgot your password?
            </NavLink>
          </div>
        </div>
        <Button disabled={isLoading} variant="btn primary-btn btn-full-width" type="submit"><img className="" src={isLoading ? Loader : Lock} alt="Workflow"/>
          Sign in
        </Button>
      </Form>
    </div>
  );
}

export default Login;

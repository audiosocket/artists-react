import React, {useEffect, useState} from "react";
import "./Welcome.scss";
import {NavLink} from "react-router-dom";
import ArrowRight from "../../../../images/right-arrow.svg";
import {ACCESS_TOKEN, WELCOME_METADATA, BASE_URL} from "../../../../common/api";
import Notiflix from "notiflix-react";
import Loader from "../../../../images/loader.svg";

function Welcome() {
  const role = JSON.parse(localStorage.getItem("userRole") ?? "");
  const [metaData, setMetadata] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchWelcomeMetadata();
  }, [])

  const fetchWelcomeMetadata = async () => {
    setIsLoading(true);
    const userAuthToken = JSON.parse(localStorage.getItem("user") ?? "");
    const response = await fetch(`${BASE_URL}${WELCOME_METADATA}`,
      {
        headers: {
          "authorization": ACCESS_TOKEN,
          "auth-token": userAuthToken
        }
      });
    if (!response.ok) {
      setMetadata(null);
      Notiflix.Notify.Failure("Can't connect to server, try later!");
    } else {
      const resultSet = await response.json();
      if(resultSet['content']) {
        setMetadata(resultSet['content']);
      }
    }
    setIsLoading(false);
  }

  return (
    <div className="welcome-content">
      <div className="next-btn">
        <NavLink to={role === "artist" ? "/agreements" : "/invites"} className="btn primary-btn next">Next <img className="" src={ArrowRight} alt="proceed-icon"/></NavLink>
      </div>
      {isLoading && <h5>Loading... <img className="loading" src={Loader} alt="loading-icon"/></h5>}
      {metaData &&
        <section dangerouslySetInnerHTML={{__html: metaData}}/>
      }
      <section>
        <h3><strong>Question?</strong></h3>
        <h5><strong>If you have any questions or suggestions, please send us an email at <a href="mailto:artists@audiosocket.com">artists@audiosocket.com</a>.</strong></h5>
        <div className="bg-content yellow">
          <div className='sub-section'>
            <h4><strong>Getting Paid</strong></h4>
            <p>We love giving artists money, but there are some important documonts we need before we can make that happen. </p>
            <p>First, make sure that you have completely and correctly filled in your payment information.</p>
          </div>

          <div className='sub-section'>
            <h4><strong>US citizens</strong></h4>
            <p>We need one W9 form on file per artist entity for whomever the payee will be. If you are an existing artist and have already sent us one, you do not need to send another. Please download one here, fill it out and sign it.</p>
            <p>Please return the W9 to <a href="mailto:artists@audiosocket.com">artists@audiosocket.com</a>.Please include your artist name. The payee on the W9 must match the bank information payee.</p>
          </div>

          <div className='sub-section'>
            <h4><strong>International artists</strong></h4>
            <p>Please complete a W8 form and return a copy to <a href="mailto:artists@audiosocket.com">artists@audiosocket.com</a>.</p>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Welcome;
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
            <p>We need one W-9 form on file per artist. If you are an existing artist and have already sent us one, you do not need to send another.</p>
            <p>Please <a href="">download from the IRS</a>, fill it out and sign it. You can either mail the completed form to us at the address below, or scan it and email to <a href="mailto:accounting@audiosocket.com">accounting@audiosocket.com</a>. Please include your artist namel</p>
            <p>If you don't send one we must withhold 28% of all future payments for tax purposes, so it's very important.</p>
          </div>

          <div className='sub-section'>
            <h4><strong>International artists</strong></h4>
            <p>Taxes are a little more complicated for you, so we've <a href="">written a document</a> to help you through the process. It may soom like a hassle, but once it's done you'll thank us for not retaining 28% of your sync revenue!</p>
          </div>

          <div className='sub-section our-address'>
            <h4><strong>Our address</strong></h4>
            <p>audiosocket</p>
            <p>3518 Fremont Ave N #400</p>
            <p>Seattle, WA 98103</p>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Welcome;
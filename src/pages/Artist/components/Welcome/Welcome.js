import React, {useEffect, useState} from "react";
import "./Welcome.scss";
import {NavLink} from "react-router-dom";
import ArrowRight from "../../../../images/right-arrow.svg";
import {ACCESS_TOKEN, WELCOME_CONTENT, BASE_URL} from "../../../../common/api";
import Notiflix from "notiflix";
import Loader from "../../../../images/loader.svg";
import {ArtistContext} from "../../../../Store/artistContext";

function Welcome() {
  const role = JSON.parse(localStorage.getItem("userRole") ?? "");
  const [metaData, setMetadata] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const {artistState, artistActions} = React.useContext(ArtistContext);

  useEffect(() => {
    if(artistState.welcomeContent) {
      setMetadata(artistState.welcomeContent);
    } else {
      fetchWelcomeMetadata();
    }
  }, [])

  const fetchWelcomeMetadata = async () => {
    setIsLoading(true);
    const userAuthToken = JSON.parse(localStorage.getItem("user") ?? "");
    const response = await fetch(`${BASE_URL}${WELCOME_CONTENT}`,
      {
        headers: {
          "authorization": ACCESS_TOKEN,
          "auth-token": userAuthToken
        }
      });
    if (!response.ok) {
      setMetadata(null);
      Notiflix.Notify.failure("Can't connect to server, try later!");
    } else {
      const resultSet = await response.json();
      if(resultSet['content']) {
        setMetadata(resultSet['content']);
        artistActions.welcomeContentStateChanged(resultSet['content']);
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
      {/* <section>
        <h3><strong>Question?</strong></h3>
        <h5><strong>If you have any questions or suggestions, please send us an email at <a href="mailto:artists@audiosocket.com">artists@audiosocket.com</a>.</strong></h5>
      </section> */}
    </div>
  )
}

export default Welcome;
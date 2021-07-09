import React, {useEffect, useState} from "react";
import "./Agreements.scss";
import {ArtistContext} from "../../../../Store/artistContext";
import {ACCESS_TOKEN, AGREEMENTS, BASE_URL} from "../../../../common/api";
import Loader from "./../../../../images/loader.svg"
import Breadcrumb from "react-bootstrap/Breadcrumb";
import {NavLink} from "react-router-dom";
import ArrowRight from "../../../../images/right-arrow.svg";
import Notiflix from "notiflix-react";

function Agreements({onChangeIsActiveProfile}) {
  const {artistState, artistActions} = React.useContext(ArtistContext);
  const [agreements, setAgreements] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isActiveProfile, setIsActiveProfile] = useState(null);

  useEffect(() => {
    if(artistState.agreements) {
      setAgreements(artistState.agreements);
      setIsActiveProfile(artistState.isActiveProfile);
    }
  }, [artistState.agreements])

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
      Notiflix.Notify.Failure('Something went wrong, try later!');
    } else {
      const resultSet = await response.json();
      const rejected = resultSet.filter(agreement => agreement.status === "rejected");
      if(rejected.length === resultSet.length) {
        artistActions.isActiveProfileStateChanged(false);
        handleChangeIsActiveProfile(false);
      } else {
        artistActions.isActiveProfileStateChanged(true);
        handleChangeIsActiveProfile(true);
      }
      Notiflix.Notify.Success('Agreement updated!');
      setAgreements(agreements);
      artistActions.agreementsStateChanged(resultSet);
    }
  }

  const handleChangeIsActiveProfile = (isActiveProfile) => {
    onChangeIsActiveProfile(isActiveProfile);
    setIsActiveProfile(isActiveProfile);
  }

  const handleNext = () => {
    if(isActiveProfile === false) {
      Notiflix.Notify.Failure('You must accept agreements to unlock Artist profile');
    }
  }

  return (
    <div className="agreementWrapper">
      <div className="next-btn">
        <NavLink onClick={handleNext} to={isActiveProfile ? "/profile" : "agreements"} className="btn primary-btn next">Next <img className="" src={ArrowRight} alt="proceed-icon"/></NavLink>
      </div>
      <div className="asBreadcrumbs">
        <Breadcrumb>
          <li className="breadcrumb-item">
            <NavLink to="/">Home</NavLink>
          </li>
          <li className="breadcrumb-item active">
            Agreements
          </li>
        </Breadcrumb>
      </div>
      <div className="agreementBody">
        <section>
          <div className="bg-content yellow bgSecondVersion mt-4">
            <p>YouTube requires artists to elect only one administrator of any given track in their Content ID system</p>
            <p>To be made available for all Audiosocket opportunities, we respectfully ask that we be your admin for the songs you would like us to license in Content ID. We ask this so our clients who are licensing your music do not receive YouTube claims from other companies. We have auto release claim technology that will ensure our clients who license your music don’t receive any claims.</p>
            <p>If you already have a YouTube admin, please contact us and let us know. This may prevent your music from being made available for certain opportunities since we are not able to contest claims that are made on the YouTube platform by other administrators. If you are unsure, or would like more information, please email <a href="mailto:artists@audiosocket.com">artists@audiosocket.com</a>.</p>
          </div>
        </section>
        {!agreements.length && isLoading && <h5>Loading agreements... <img className="loading" src={Loader} alt="loading-icon"/></h5> }
        {agreements.length !== 0 &&
          agreements.map((agreement, key)=> {
            return (
              <section key={key} className="pt-4">
                <h2 className="agreementType">{agreement.agreement.agreement_type.replace("_", " ")} Agreement</h2>
                <small className="status-timestamp"><i><span className={agreement.status}>{agreement.status}</span> on {agreement.status_updated_at || '**-**-****'} by <strong>{agreement.agreement_user ? agreement.agreement_user : 'NA'}</strong></i></small>
                <div className="agreementContent mt-3">
                  <p dangerouslySetInnerHTML={{__html: agreement.agreement.content}} />
                </div>
                <div className="agreementContentController">
                  <button onClick={handleSubmitReviewAgreement} data-id={agreement.id} data-action={agreement.status === "accepted" ? "rejected" : "accepted"} className={agreement.status === "accepted" ? "btn primary-btn rejected" : "btn primary-btn accepted"}>{agreement.status === "rejected" ? "Accept" : "Opt-out"}</button>
                  <a href={agreement.agreement.file} target="_blank" rel="noopener noreferrer" download>Download PDF</a>
                </div>
              </section>
              )
          })
        }
      </div>
    </div>
  )
}

export default Agreements;
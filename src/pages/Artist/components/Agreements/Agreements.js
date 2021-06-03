import React, {useEffect, useState} from "react";
import "./Agreements.scss";
import {ArtistContext} from "../../../../Store/artistContext";
import {ACCESS_TOKEN, AGREEMENTS, BASE_URL} from "../../../../common/api";
import Loader from "./../../../../images/loader.svg"
import Breadcrumb from "react-bootstrap/Breadcrumb";
import {NavLink, useHistory} from "react-router-dom";
import fetchAgreements from "../../../../common/utlis/fetchAgreements";

function Agreements() {
  const {artistState, artistActions} = React.useContext(ArtistContext);
  const [agreements, setAgreements] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const history = useHistory();

  useEffect(() => {
    if(artistState.agreements)
      setAgreements(artistState.agreements);
    else
      getAgreements();
  }, [artistState.agreements])

  const getAgreements = async () => {
    setIsLoading(true);
    const agreements = await fetchAgreements();
    artistActions.artistStateChanged(agreements);
    setAgreements(agreements);
    setIsLoading(false);
  }

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
      alert("Something went wrong, try later!");
    } else {
      const resultSet = await response.json();
      const rejected = resultSet.filter(agreement => agreement.status === "rejected");
      if(rejected.length === resultSet.length) {
        alert("Sorry, you can't proceed without accepting agreements.\nContact at artists@audiosocket.com for more details.")
        localStorage.removeItem("user");
        history.push("/login");
      } else {
        alert("agreement updated");
        artistActions.agreementsStateChanged(resultSet);
      }
    }
  }

  return (
    <div className="agreementWrapper">
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
            <p>YouTube requires artists elect only one administrator when managing your recordings on their platform. To be made available for all Audiosockel opportunities, we need to be your administrator so our clients who are licensing your music are not being sent copyright Infringement claims from other companies.</p>
            <p>If you already have an agent, you must opt out of our YouTube portion of the agreement. This will provent your music from being made available for digital and web media opportunities since wo are not able to contest claims that are made on the YouTube platform by other administrators. If
            you are unsure, or would like more information, please email <a href="mailto:artists@audiosocket.com">artists@audiosocket.com</a>.</p>
          </div>
        </section>
        {!agreements.length && isLoading && <h5>Loading agreements... <img className="loading" src={Loader} alt="loading-icon"/></h5> }
        {agreements.length !== 0 &&
          agreements.map((agreement, key)=> {
            return (
              <section key={key} className="pt-4">
                <h2 className="agreementType">{agreement.agreement.agreement_type.replace("_", " ")} Agreement</h2>
                <div className="agreementContent mt-3">
                  <p>{agreement.agreement.content}</p>
                </div>
                <div className="agreementContentController">
                  <button onClick={handleSubmitReviewAgreement} data-id={agreement.id} data-action={agreement.status === "accepted" ? "rejected" : "accepted"} className={agreement.status === "accepted" ? "btn primary-btn rejected" : "btn primary-btn accepted"}>I wish to {agreement.status === "rejected" ? "opt-in to" : "opt-out of"} this agreement</button>
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
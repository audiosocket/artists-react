import React, {useEffect, useState} from "react";
import "./Invites.scss";
import {ArtistContext} from "../../../../Store/artistContext";
import {ACCESS_TOKEN, ARTISTS_COLLABORATORS, BASE_URL} from "../../../../common/api";
import Loader from "./../../../../images/loader.svg"
import Breadcrumb from "react-bootstrap/Breadcrumb";
import {NavLink} from "react-router-dom";
import fetchArtistsList from "../../../../common/utlis/fetchArtistsList";
import NavDropdown from "react-bootstrap/NavDropdown";
import ArrowRight from "../../../../images/right-arrow.svg";
import Notiflix from "notiflix-react";

function Invites() {
  const {artistState, artistActions} = React.useContext(ArtistContext);
  const [isLoading, setIsLoading] = useState(false);
  const [artistsList, setArtistList] = useState([]);

  useEffect(() => {
    if(artistState.artistsList) {
      setArtistList(artistState.artistsList);
    }
  }, [artistState.artistsList])

  const handleChangeStatus = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const artist_id = e.target.dataset.id;
    const status = e.target.dataset.key;
    let selectedArtist = artistsList.filter((artist) => artist.id === parseInt(e.target.dataset.id));
    if(!selectedArtist.length)
      return false;
    const data = new FormData();
    data.append('status', status);
    const userAuthToken = JSON.parse(localStorage.getItem("user") ?? "");
    const response = await fetch(`${BASE_URL}${ARTISTS_COLLABORATORS}/${artist_id}/update_status`,
      {
        headers: {
          "authorization": ACCESS_TOKEN,
          "auth-token": userAuthToken
        },
        method: 'PATCH',
        body: data
      });
    if(!response.ok) {
      Notiflix.Notify.Failure('Something went wrong, try later!');
    } else {
      const artistsList = await fetchArtistsList();
      artistActions.artistsListStateChanged(artistsList)
      setArtistList(artistsList);
      Notiflix.Report.Success( 'Request fulfilled', `Your invite status updated successfully!`, 'Ok' );
    }
    setIsLoading(false);
  }

  return (
    <div className="agreementWrapper">
      <div className="next-btn">
        <NavLink to={"/agreements"} className="btn primary-btn next">Next <img
          className="" src={ArrowRight} alt="proceed-icon"/></NavLink>
      </div>
      <div className="asBreadcrumbs">
        <Breadcrumb>
          <li className="breadcrumb-item">
            <NavLink to="/">Home</NavLink>
          </li>
          <li className="breadcrumb-item active">
            Invites
          </li>
        </Breadcrumb>
      </div>
      <div className="agreementBody">
        {!artistsList.length && isLoading && <h5>Loading artists... <img className="loading" src={Loader} alt="loading-icon"/></h5> }
        {artistsList.length !== 0 &&
        <div className="section-head">
          <h2 className="pt-0">Following {artistsList.length === 1 ? 'artist has' : 'artists have'} invited you as a collaborator</h2>
        </div>
        }
        <div className="invite-contain-head">
          <span className="invite-artist">Artist</span>
          <span className="access-type">Permissions</span>
          <span className="agreements">Status {artistsList.length !== 0 && isLoading && <img className="loading" src={Loader} alt="loading-icon"/>}</span>
        </div>
        {artistsList.length !== 0 &&
          artistsList.map((artist, key)=> {
            return (
              <section key={key} className="pt-4">
                <div className="invite-contain">
                  <div className="invite-artist">{artist.first_name+' '+artist.last_name}</div>
                  <span className="access-type">{artist.access}</span>
                  <NavDropdown title={artist.status} id="collasible-nav-dropdown" className="invite-status">
                    <NavDropdown.Item key={"pending"} onClick={handleChangeStatus} data-id={artist.id} data-key="pending" className={artist.status === "pending" ? "active" : ""}>Pending</NavDropdown.Item>
                    <NavDropdown.Item key={"accepted"} onClick={handleChangeStatus} data-id={artist.id} data-key="accepted" className={artist.status === "accepted" ? "active" : ""}>Accepted</NavDropdown.Item>
                    <NavDropdown.Item key={"rejected"} onClick={handleChangeStatus} data-id={artist.id} data-key="rejected" className={artist.status === "rejected" ? "active" : ""}>Rejected</NavDropdown.Item>
                  </NavDropdown>
                </div>
              </section>
            )
          })
        }
      </div>
    </div>
  )
}

export default Invites;
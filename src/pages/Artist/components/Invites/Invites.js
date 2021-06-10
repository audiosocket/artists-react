import React, {useEffect, useState} from "react";
import "./Invites.scss";
import {ArtistContext} from "../../../../Store/artistContext";
import {ACCESS_TOKEN, ARTISTS_COLLABORATORS, BASE_URL} from "../../../../common/api";
import Loader from "./../../../../images/loader.svg"
import Breadcrumb from "react-bootstrap/Breadcrumb";
import {NavLink} from "react-router-dom";
import Form from "react-bootstrap/Form";
import fetchArtistsList from "../../../../common/utlis/fetchArtistsList";

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
    setIsLoading(true);
    const artist_id = e.target.dataset.id;
    let selectedArtist = artistsList.filter((artist) => artist.id === parseInt(e.target.dataset.id));
    selectedArtist = selectedArtist[0];
    if(selectedArtist.access === "read")
      return false;
    const status = selectedArtist.agreements ? 'rejected' : 'accepted';
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
      alert("Something went wrong, try later!");
    } else {
      const artistsList = await fetchArtistsList();
      artistActions.artistsListStateChanged(artistsList)
      setArtistList(artistsList);
      alert("Invitation updated");
    }
    setIsLoading(false);
  }

  return (
    <div className="agreementWrapper">
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
        {!artistsList.length && isLoading && <h5>Loading agreements... <img className="loading" src={Loader} alt="loading-icon"/></h5> }
        {artistsList.length !== 0 &&
        <div className="section-head">
          <h2 className="pt-0">Following {artistsList.length === 1 ? 'artist has' : 'artists have'} invited you as a collaborator</h2>
        </div>
        }
        <div className="invite-contain-head">
          <span className="invite-artist">Artist</span>
          <span className="access-type">Permissions</span>
          <span className="agreements">Agreements</span>
        </div>
        {artistsList.length !== 0 &&
          artistsList.map((artist, key)=> {
            return (
              <section key={key} className="pt-4">
                <div className="invite-contain">
                  <div className="invite-artist">{artist.first_name+' '+artist.last_name}</div>
                  <span className="access-type">{artist.access}</span>
                  <Form.Check
                    disabled={artist.access === "read"}
                    type="switch"
                    id={"custom-switch-"+key}
                    name="role"
                    defaultChecked={artist.agreements}
                    onChange={handleChangeStatus}
                    data-id={artist.id}
                    label={artist.agreements ? "Accepted" : "Rejected"}
                  />
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
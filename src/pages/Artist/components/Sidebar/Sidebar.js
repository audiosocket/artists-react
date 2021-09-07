import React from "react";
import './Sidebar.scss';
import {NavLink, useHistory} from "react-router-dom";
import {ArtistContext} from "../../../../Store/artistContext";
import Notiflix from "notiflix";

function Sidebar() {
  const {artistState} = React.useContext(ArtistContext);
  const history = useHistory();

  const handleClickIsActive = (page) => {
    if(artistState.isActiveProfile === false) {
      Notiflix.Report.Warning( 'Not authorized', `You must accept agreements to unlock ${page} page`, 'Go to agreements', () => {
        history.push('/agreements');
      } );
    }
    else if(artistState.isProfileCompleted === false && (page === 'Partners' || page === 'Music')) {
      Notiflix.Report.Warning( 'Not authorized', `You must complete artist profile to unlock ${page} page`, 'Go to profile', () => {
        history.push('/profile');
      } );
    }
  }

  return (
    <aside>
      <ul>
        <li>
          <NavLink
            activeClassName={"selected"}
            exact={true}
            to={"/"}>
            Welcome
          </NavLink>
        </li>
        {artistState.userRole === 'collaborator' &&
          <li>
            <NavLink
              activeClassName={"selected"}
              exact={true}
              to={"/invites"}>
              Invites
            </NavLink>
          </li>
        }
        <li>
          <NavLink
            activeClassName={"selected"}
            to={"/agreements"}>
            Agreements
          </NavLink>
        </li>
        <li>
          <NavLink
            onClick={() => handleClickIsActive('Artist')}
            activeClassName={artistState.isActiveProfile ? "selected" : ""}
            to={artistState.isActiveProfile ? "/profile" : "/agreements"}>
            Artist
          </NavLink>
        </li>
        <li>
          <NavLink
            onClick={() => handleClickIsActive('Partners')}
            activeClassName={artistState.isActiveProfile ? artistState.isProfileCompleted ? "selected" : "" : ""}
            to={artistState.isActiveProfile ? artistState.isProfileCompleted ? "/partners" : "/profile" : "/agreements"}>
            Partners
          </NavLink>
        </li>
        <li>
          <NavLink
            onClick={() => handleClickIsActive('Music')}
            activeClassName={artistState.isActiveProfile ? artistState.isProfileCompleted ? "selected" : "" : ""}
            to={artistState.isActiveProfile ? artistState.isProfileCompleted ? "/music" : "/profile" : "/agreements"}>
            Music
          </NavLink>
        </li>
        <li>
          <NavLink
            activeClassName={"selected"}
            to={"/faq"}>
            FAQs
          </NavLink>
        </li>
      </ul>
    </aside>
  );
}

export default Sidebar;
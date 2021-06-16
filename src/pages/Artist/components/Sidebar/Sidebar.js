import React from "react";
import './Sidebar.scss';
import {NavLink} from "react-router-dom";
import {ArtistContext} from "../../../../Store/artistContext";

function Sidebar() {
  const {artistState} = React.useContext(ArtistContext);

  const handleClickIsActive = (page) => {
    if(artistState.isActiveProfile === false) {
      alert(`You must accept agreements to unlock ${page} page`);
    }
    else if(artistState.isProfileCompleted === false && (page === 'Partners' || page === 'Music')) {
      alert(`You must complete artist profile to unlock ${page} page`);
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
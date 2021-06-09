import React from "react";
import './Sidebar.scss';
import {NavLink, useHistory} from "react-router-dom";
import {ArtistContext} from "../../../../Store/artistContext";

function Sidebar() {
  const {artistState, artistActions} = React.useContext(ArtistContext);
  const history = useHistory();

  const handleClickIsActive = (page) => {
    if(artistState.isActiveProfile === false) {
      alert(`You must accept agreements to unlock ${page} page`);
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
            activeClassName={artistState.isActiveProfile ? "selected" : ""}
            to={artistState.isActiveProfile ? "/partners" : "/agreements"}>
            Partners
          </NavLink>
        </li>
        <li>
          <NavLink
            onClick={() => handleClickIsActive('Music')}
            activeClassName={artistState.isActiveProfile ? "selected" : ""}
            to={artistState.isActiveProfile ? "/music" : "/agreements"}>
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
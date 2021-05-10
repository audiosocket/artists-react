import React from "react";
import './Sidebar.scss';
import {NavLink} from "react-router-dom";

function Sidebar() {
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
            to={"/profile"}>
            Artist
          </NavLink>
        </li>
        <li>
          <NavLink
            activeClassName={"selected"}
            to={"/agreements"}>
            Agreements
          </NavLink>
        </li>
        <li><a>Partners</a></li>
        <li><a>Music</a></li>
        <li><a>Artist Portal</a></li>
        <li><a>Getting Paid</a></li>
        <li><a>FAQs</a></li>
      </ul>
    </aside>
  );
}

export default Sidebar;
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
        <li>
          <NavLink
            activeClassName={"selected"}
            to={"/partners"}>
            Partners
          </NavLink>
        </li>
        <li>
          <NavLink
            activeClassName={"selected"}
            to={"/music"}>
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
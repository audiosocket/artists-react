import React from "react";
import { Link } from "react-router-dom";
import help from "../images/as-help.svg";
import Nav from "react-bootstrap/Nav";

const ButtonMailto = ({ mailto, label }) => {
  return (
    <Link
      to='#'
      onClick={(e) => {
        window.location = mailto;
        e.preventDefault();
      }}
    >
      <span className="desktop-view">Help</span>
      <img src={help} alt="Help"  className="mobile-view" />
    </Link>
  );
};

export default ButtonMailto;
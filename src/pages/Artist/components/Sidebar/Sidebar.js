import React from "react";
import './Sidebar.scss';

function Sidebar() {
  return (
    <aside>
      <ul>
        <li><a href="" className="selected">Welcome</a></li>
        <li><a href="">Agreement</a></li>
        <li><a href="">Partners</a></li>
        <li><a href="">Music</a></li>
        <li><a href="">Artist Portal</a></li>
        <li><a href="">Getting Paid</a></li>
        <li><a href="">FAQs</a></li>
      </ul>
    </aside>
  );
}

export default Sidebar;
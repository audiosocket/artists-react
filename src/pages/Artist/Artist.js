import React from "react";
import '../../App.scss';
import Header from "./components/Header/Header";
import Sidebar from "./components/Sidebar/Sidebar";
import Footer from "./components/Footer/Footer";

function Artist() {
  return (
    <div className="welcome-page">
      <Header/>
      <div className="content-wrapper">
        <Sidebar />
        <div className="right-content">Body</div>
      </div>
    </div>
  );
}

export default Artist;

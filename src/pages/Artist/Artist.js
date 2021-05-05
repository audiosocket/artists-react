import React from "react";
import '../../App.scss';
import Header from "./components/Header/Header";
import Sidebar from "./components/Sidebar/Sidebar";
import Footer from "./components/Footer/Footer";

function Artist() {
  return (
    <div className="contain">
      <Header/>
      <Sidebar />
      <div className="body-container">Body</div>
      <Footer />
    </div>
  );
}

export default Artist;

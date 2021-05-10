import React from "react";
import '../../App.scss';
import Header from "./components/Header/Header";
import Sidebar from "./components/Sidebar/Sidebar";
import { Switch, Route } from "react-router-dom";
import Welcome from "./components/Welcome/Welcome";
import Agreements from "./components/Agreements/Agreements";
import Profile from "./components/Profile/Profile";

function Artist() {
  return (
    <div className="welcome-page">
      <Header/>
      <div className="content-wrapper">
        <Sidebar />
        <div className="right-content">
          <Switch>
            <Route path="/profile">
              <Profile />
            </Route>
            <Route path="/agreements">
              <Agreements />
            </Route>
            <Route path="/">
              <Welcome />
            </Route>
          </Switch>
        </div>
      </div>
    </div>
  );
}

export default Artist;

import React from "react";
import '../../App.scss';
import {ArtistProvider} from "../../Store/artistContext";
import { Switch, Route } from "react-router-dom";
import Header from "./components/Header/Header";
import Sidebar from "./components/Sidebar/Sidebar";
import Welcome from "./components/Welcome/Welcome";
import Agreements from "./components/Agreements/Agreements";
import Profile from "./components/Profile/Profile";
import Partners from "./components/Partners/Partners";
import Music from "./components/Music/Music";
import Bank from "./components/Bank/Bank";
import Tax from "./components/Tax/Tax";
import Faq from "./components/Faq/Faq";

function Artist() {
  return (
    <ArtistProvider>
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
              <Route path="/partners">
                <Partners />
              </Route>
              <Route path="/music">
                <Music />
              </Route>
              <Route path="/bank">
                <Bank />
              </Route>
              <Route path="/tax">
                <Tax />
              </Route>
              <Route path="/faq">
                <Faq />
              </Route>
              <Route path="/">
                <Welcome />
              </Route>
            </Switch>
          </div>
        </div>
      </div>
    </ArtistProvider>
  );
}

export default Artist;

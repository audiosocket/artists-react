import React, {useState} from "react";
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
import Faq from "./components/Faq/Faq";
import Invites from "./components/Invites/Invites";

function Artist() {
  const [isActiveProfile, setIsActiveProfile] = useState(true);
  const [isProfileCompleted, setIsProfileCompleted] = useState(true);
  const [toggleSidebar, setToggleSidebar] = useState(false);
  const userRole = localStorage.getItem("userRole") ? JSON.parse(localStorage.getItem("userRole") ?? "") : "";

  const handleChangeIsActiveProfile = (isActiveProfile) => {
    setIsActiveProfile(isActiveProfile);
  }

  const handleChangeIsProfileCompleted = (isProfileCompleted) => {
    setIsProfileCompleted(isProfileCompleted);
  }

  const handleToggle = (toggleSidebar) => {
    setToggleSidebar(!toggleSidebar);
  }


  return (
    <ArtistProvider>
      <div className="welcome-page">
        <Header onToggleSidebar={handleToggle} onChangeIsActiveProfile={handleChangeIsActiveProfile} onChangeIsProfileCompleted={handleChangeIsProfileCompleted} />
        <div className={toggleSidebar ? "content-wrapper launch-sidebar" : "content-wrapper "}>
          <Sidebar />
          <div className="right-content">
            <Switch>
              {userRole === 'collaborator' &&
              <Route path="/invites">
                <Invites/>
              </Route>
              }
              <Route path="/agreements">
                <Agreements onChangeIsActiveProfile={handleChangeIsActiveProfile}/>
              </Route>
              {isActiveProfile &&
              <Route path={"/profile"}>
                <Profile onChangeIsProfileCompleted={handleChangeIsProfileCompleted}/>
              </Route>
              }
              {isActiveProfile === true && isProfileCompleted === true &&
                <Route path="/partners">
                  <Partners/>
                </Route>
              }
              {isActiveProfile === true && isProfileCompleted === true &&
                <Route path="/music">
                  <Music/>
                </Route>
              }
              <Route path="/faq">
                <Faq/>
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

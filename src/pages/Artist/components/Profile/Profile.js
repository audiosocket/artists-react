import React from "react";
import "./Profile.scss";
import {Route, Switch} from "react-router-dom";
import ProfileEdit from "./ProfileEdit";
import ProfileView from "./ProfileView";

function Profile() {

  return (
    <Switch>
      <Route exact={true} path="/profile">
        <ProfileView />
      </Route>
      <Route exact={true} path="/profile/edit">
        <ProfileEdit />
      </Route>
    </Switch>
  )
}

export default Profile;
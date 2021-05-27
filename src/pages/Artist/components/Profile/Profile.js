import React from "react";
import "./Profile.scss";
import {Route, Switch} from "react-router-dom";
import ProfileEdit from "./ProfileEdit";
import ProfileView from "./ProfileView";
import ContactEdit from "./ContactEdit";
import Payment from "./Payment/Payment";
import Tax from "./Tax/Tax";

function Profile() {

  return (
    <Switch>
      <Route exact={true} path="/profile">
        <ProfileView />
      </Route>
      <Route exact={true} path="/profile/edit">
        <ProfileEdit />
      </Route>
      <Route exact={true} path="/profile/contact/edit">
        <ContactEdit />
      </Route>
      <Route exact={true} path="/profile/payment/edit">
        <Payment />
      </Route>
      <Route exact={true} path="/profile/tax/edit">
        <Tax />
      </Route>
    </Switch>
  )
}

export default Profile;
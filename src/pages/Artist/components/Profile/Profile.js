import React, {useEffect} from "react";
import "./Profile.scss";
import {Route, Switch} from "react-router-dom";
import ProfileEdit from "./ProfileEdit";
import ProfileView from "./ProfileView";
import ContactEdit from "./ContactEdit";
import Payment from "./Payment/Payment";
import Tax from "./Tax/Tax";
import {ArtistContext} from "../../../../Store/artistContext";

function Profile({onChangeIsProfileCompleted}) {
  const {artistState, artistActions} = React.useContext(ArtistContext);

  useEffect(() => {
    if(artistState.artist) {
      if(!artistState.artist.banner_image || !artistState.artist.profile_image || !artistState.artist.contact_information || !artistState.artist.payment_information || !artistState.artist.tax_information) {
        artistActions.isProfileCompletedStateChanged(false);
        onChangeIsProfileCompleted(false);
      } else {
        artistActions.isProfileCompletedStateChanged(true);
        onChangeIsProfileCompleted(true);
      }
    }
  }, [artistState.artist])

  return (
    <Switch>
      <Route exact={true} path="/profile">
        <ProfileView/>
      </Route>
      {(!artistState.selectedArtist || artistState.selectedArtist.access === 'write') &&
      <Route exact={true} path="/profile/edit">
        <ProfileEdit/>
      </Route>
      }
      {(!artistState.selectedArtist || artistState.selectedArtist.access === 'write') &&
      <Route exact={true} path="/profile/contact/edit">
        <ContactEdit/>
      </Route>
      }
      {(!artistState.selectedArtist || artistState.selectedArtist.access === 'write') &&
      <Route exact={true} path="/profile/payment/edit">
        <Payment/>
      </Route>
      }
      {(!artistState.selectedArtist || artistState.selectedArtist.access === 'write') &&
      <Route exact={true} path="/profile/tax/edit">
        <Tax/>
      </Route>
      }
    </Switch>
  )
}

export default Profile;
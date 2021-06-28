import React, { useReducer } from "react";
import {
  initialState,
  reducer,
  USER_ROLE_STATE_CHANGED,
  ARTIST_STATE_CHANGED,
  ARTISTS_LIST_STATE_CHANGED,
  SELECTED_ARTIST_STATE_CHANGED,
  AGREEMENTS_STATE_CHANGED,
  ALBUMS_STATE_CHANGED,
  COUNTRIES_STATE_CHANGED,
  COLLABORATORS_STATE_CHANGED,
  PUBLISHERS_STATE_CHANGED,
  IS_ACTIVE_PROFILE_STATE_CHANGED,
  IS_PROFILE_COMPLETED_STATE_CHANGED,
  WELCOME_CONTENT_STATE_CHANGED,
} from "./artistReducer";

const ArtistContext = React.createContext();

const ArtistProvider = (props) => {
  const [artistState, dispatch] = useReducer(reducer, initialState);
  const actions = {
    userRoleStateChanged: (userRole) => {
      dispatch({ type: USER_ROLE_STATE_CHANGED, payload: userRole });
    },
    artistStateChanged: (artist) => {
      dispatch({ type: ARTIST_STATE_CHANGED, payload: artist });
    },
    artistsListStateChanged: (artistsList) => {
      dispatch({ type: ARTISTS_LIST_STATE_CHANGED, payload: artistsList });
    },
    selectedArtistStateChanged: (selectedArtist) => {
      dispatch({ type: SELECTED_ARTIST_STATE_CHANGED, payload: selectedArtist });
    },
    agreementsStateChanged: (agreements) => {
      dispatch({ type: AGREEMENTS_STATE_CHANGED, payload: agreements });
    },
    albumsStateChanged: (albums) => {
      dispatch({ type: ALBUMS_STATE_CHANGED, payload: albums });
    },
    countriesStateChanged: (countries) => {
      dispatch({ type: COUNTRIES_STATE_CHANGED, payload: countries });
    },
    collaboratorsStateChanged: (collaborators) => {
      dispatch({ type: COLLABORATORS_STATE_CHANGED, payload: collaborators });
    },
    publishersStateChanged: (publishers) => {
      dispatch({ type: PUBLISHERS_STATE_CHANGED, payload: publishers });
    },
    isActiveProfileStateChanged: (isActiveProfile) => {
      dispatch({ type: IS_ACTIVE_PROFILE_STATE_CHANGED, payload: isActiveProfile });
    },
    isProfileCompletedStateChanged: (isProfileCompleted) => {
      dispatch({ type: IS_PROFILE_COMPLETED_STATE_CHANGED, payload: isProfileCompleted });
    },
    welcomeContentStateChanged: (welcomeContent) => {
      dispatch({ type: WELCOME_CONTENT_STATE_CHANGED, payload: welcomeContent });
    },
  };

  return (
    <ArtistContext.Provider
      value={{
        artistState: artistState,
        artistActions: actions,
      }}
    >
      {props.children}
    </ArtistContext.Provider>
  );
}

export { ArtistProvider, ArtistContext };
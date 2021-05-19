import React, { useReducer } from "react";
import {
  initialState,
  reducer,
  USER_ROLE_STATE_CHANGED,
  ARTIST_STATE_CHANGED,
  ARTISTS_LIST_STATE_CHANGED,
  SELECTED_ARTIST_STATE_CHANGED,
  AGREEMENTS_STATE_CHANGED
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
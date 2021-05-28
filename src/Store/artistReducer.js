export const initialState = {
  userRole: null,
  artist: null,
  artistsList: null,
  selectedArtist: null,
  agreements: null,
  albums: null,
  countries: null,
  collaborators: null,
  publishers: null
};

export const USER_ROLE_STATE_CHANGED = "USER_ROLE_STATE_CHANGED";
export const ARTIST_STATE_CHANGED = "ARTIST_STATE_CHANGED";
export const ARTISTS_LIST_STATE_CHANGED = "ARTISTS_LIST_STATE_CHANGED";
export const SELECTED_ARTIST_STATE_CHANGED = "SELECTED_ARTIST_STATE_CHANGED";
export const AGREEMENTS_STATE_CHANGED = "AGREEMENTS_STATE_CHANGED";
export const ALBUMS_STATE_CHANGED = "ALBUMS_STATE_CHANGED";
export const COUNTRIES_STATE_CHANGED = "COUNTRIES_STATE_CHANGED";
export const COLLABORATORS_STATE_CHANGED = "COLLABORATORS_STATE_CHANGED";
export const PUBLISHERS_STATE_CHANGED = "PUBLISHERS_STATE_CHANGED";

export const reducer = (state, action) => {
  switch (action.type) {
    case USER_ROLE_STATE_CHANGED:
      return {
        ...state,
        userRole: action.payload,
      };
    case ARTIST_STATE_CHANGED:
      return {
        ...state,
        artist: action.payload,
      };
    case ARTISTS_LIST_STATE_CHANGED:
      return {
        ...state,
        artistsList: action.payload,
      };
    case SELECTED_ARTIST_STATE_CHANGED:
      return {
        ...state,
        selectedArtist: action.payload,
      };
    case AGREEMENTS_STATE_CHANGED:
      return {
        ...state,
        agreements: action.payload,
      };
    case ALBUMS_STATE_CHANGED:
      return {
        ...state,
        albums: action.payload,
      };
    case COUNTRIES_STATE_CHANGED:
      return {
        ...state,
        countries: action.payload,
      };
    case COLLABORATORS_STATE_CHANGED:
      return {
        ...state,
        collaborators: action.payload,
      };
    case PUBLISHERS_STATE_CHANGED:
      return {
        ...state,
        publishers: action.payload,
      };
  }
  return state;
};

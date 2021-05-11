export const initialState = {
  userRole: null,
  artist: null,
  artistsList: null,
  selectedArtist: null,
};

export const USER_ROLE_STATE_CHANGED = "USER_ROLE_STATE_CHANGED";
export const ARTIST_STATE_CHANGED = "ARTIST_STATE_CHANGED";
export const ARTISTS_LIST_STATE_CHANGED = "ARTISTS_LIST_STATE_CHANGED";
export const SELECTED_ARTIST_STATE_CHANGED = "SELECTED_ARTIST_STATE_CHANGED";

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
  }
  return state;
};

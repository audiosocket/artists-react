import React, { useReducer } from "react";
import {
  initialState,
  reducer,
  USER_DATA_STATE_CHANGED,
} from "./authReducer";

const AuthContext = React.createContext();

const AuthProvider = (props) => {
  const [authState, dispatch] = useReducer(reducer, initialState);

  const actions = {
    userDataStateChanged: (user) => {
      dispatch({ type: USER_DATA_STATE_CHANGED, payload: user });
    },
  };

  return (
    <AuthContext.Provider
      value={{
        authState: authState,
        authActions: actions,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
};

export { AuthProvider, AuthContext };

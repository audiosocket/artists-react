import './App.scss';
import {BrowserRouter as Router, Redirect, Route, Switch} from "react-router-dom";
import {AuthProvider} from "./Store/authContext";
import Artist from "./pages/Artist/Artist";
import Login from "./pages/Login/Login";

function App() {
  return (
    <Router>
      <AuthProvider>
        <Switch>
          <Route path="/login">
            <Login/>
          </Route>
          <Route path="/">
            <Artist/>
          </Route>
        </Switch>
      </AuthProvider>
    </Router>
  );
}

function PrivateRoute({ children, ...rest }) {
  return (
    <Route
      {...rest}
      render={({ location }) =>
        localStorage.getItem("user") ? (
          children
        ) : (
          <Redirect
            to={{
              pathname: "/login",
              state: { from: location },
            }}
          />
        )
      }
    />
  );
}

export default App;

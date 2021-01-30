import React, { useState } from "react";
import { Route, Redirect } from "react-router-dom";
import { useAuth } from "../_context/auth";

function PrivateRoute({ component: Component, ...rest }) {
  const { authTokens } = useAuth();
  console.log('authTokens', authTokens)
  const [loggedIN, setLoggedIN] = useState(sessionStorage.getItem('loggedIN'))
  const [authToken, setAuthToken] = useState(sessionStorage.getItem('AuthToken'))

  return (
    <Route
      {...rest}
      render={props =>
        authToken ? (
          <Component {...props} />
        ) : (
          <Redirect
            to={{ pathname: "/login", state: { referer: props.location } }}
          />
        )
      }
    />
  );
}

export default PrivateRoute;
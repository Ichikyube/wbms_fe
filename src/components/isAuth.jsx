import React from 'react';
import { Route, Redirect, Navigate } from 'react-router-dom';

const AuthenticatedRoute = ({ component: Component, isAuthenticated, ...rest }) => (
  <Route
    {...rest}
    render={(props) =>
      isAuthenticated ?( <Component {...props} /> ) : ( <Redirect to="/login" /> )
    }

  />
);

export default AuthenticatedRoute;
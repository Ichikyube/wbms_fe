import React from 'react';
import { Route, Navigate } from 'react-router-dom';

const AuthenticatedRoute = ({ component: Component, isAuthenticated, ...rest }) => (
  <Route
    {...rest}
    render={(props) =>
      isAuthenticated ? <Navigate to="/dashboard" /> : <Component {...props} />
    }
  />
);

export default AuthenticatedRoute;


import React from "react";
import { Route, Outlet, Navigate } from "react-router-dom";

const AuthenticatedRoute = ({
  Component,
  isAuthenticated,
  redirectTo,
  ...rest
}) => {
  return isAuthenticated ? (
    <Outlet {...rest} />
  ) : (
    <Navigate to={redirectTo || "/"} replace />
  );
};

export default AuthenticatedRoute;

const GuestRoute = ({ component: Component, ...rest }) => {
  const isAuthenticated = true;// Your authentication logic to determine if the user is authenticated

  return (
    <Route
      {...rest}
      render={(props) =>
        isAuthenticated ? (
          <Redirect to="/dashboard" />
        ) : (
          <Component {...props} />
        )
      }
    />
  );
};

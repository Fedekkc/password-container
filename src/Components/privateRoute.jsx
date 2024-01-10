import { Route, Navigate } from 'react-router-dom';

const PrivateRoute = ({ element: Component, isLoggedIn, ...rest }) => {
  return isLoggedIn ? <Route {...rest} element={Component} /> : <Navigate to="/login" />;
};

export default PrivateRoute;
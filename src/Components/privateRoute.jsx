import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children, isLoggedIn}) => {

  return isLoggedIn ? <>{children}</> : <Navigate to="/login" />; // Si el usuario está logueado, renderiza el children, si no, redirige a la ruta /login
};

export default PrivateRoute;
import { Navigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';

/**
 * Protected route wrapper that requires authentication
 */
const PrivateRoute = ({ children }) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default PrivateRoute;

import { Navigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';

/**
 * Route wrapper that redirects authenticated users away from auth pages
 */
const GuestRoute = ({ children }) => {
  const { isAuthenticated, user } = useAuthStore((state) => ({
    isAuthenticated: state.isAuthenticated,
    user: state.user,
  }));

  if (isAuthenticated) {
    // Redirect based on role
    if (user?.role === 'admin') {
      return <Navigate to="/admin/dashboard" replace />;
    }
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default GuestRoute;

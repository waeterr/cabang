import { Navigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';

/**
 * Route wrapper that requires admin role
 */
const AdminRoute = ({ children }) => {
  const { isAuthenticated, user } = useAuthStore((state) => ({
    isAuthenticated: state.isAuthenticated,
    user: state.user,
  }));

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (user?.role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default AdminRoute;

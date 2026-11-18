import { Navigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';

/**
 * Route wrapper that requires user to be verified
 */
const VerifiedRoute = ({ children }) => {
  const { isAuthenticated, user } = useAuthStore((state) => ({
    isAuthenticated: state.isAuthenticated,
    user: state.user,
  }));

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!user?.is_verified || user?.verification_status !== 'approved') {
    return <Navigate to="/verification-pending" replace />;
  }

  return children;
};

export default VerifiedRoute;

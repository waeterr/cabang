import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import { getCurrentUser } from '../api/auth';

export const useAuth = () => {
  const navigate = useNavigate();
  const { user, token, isAuthenticated, setAuth, setUser, clearAuth, setLoading, isAdmin, isVerified } = useAuthStore();

  // Refresh user data from server
  const refreshUser = async () => {
    try {
      setLoading(true);
      const response = await getCurrentUser();
      setUser(response.user);
    } catch (error) {
      console.error('Failed to refresh user:', error);
      clearAuth();
      navigate('/login');
    } finally {
      setLoading(false);
    }
  };

  // Check auth on mount
  useEffect(() => {
    if (token && !user) {
      refreshUser();
    }
  }, [token]);

  return {
    user,
    token,
    isAuthenticated,
    isAdmin: isAdmin(),
    isVerified: isVerified(),
    setAuth,
    setUser,
    clearAuth,
    refreshUser,
  };
};

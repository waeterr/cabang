import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,

      // Set user and token after login/register
      setAuth: (user, token) => {
        localStorage.setItem('auth_token', token);
        localStorage.setItem('user', JSON.stringify(user));
        set({
          user,
          token,
          isAuthenticated: true,
        });
      },

      // Update user data
      setUser: (user) => {
        localStorage.setItem('user', JSON.stringify(user));
        set({ user });
      },

      // Clear auth state on logout
      clearAuth: () => {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user');
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        });
      },

      // Set loading state
      setLoading: (isLoading) => set({ isLoading }),

      // Check if user is admin
      isAdmin: () => {
        const { user } = get();
        return user?.role === 'admin';
      },

      // Check if user is verified
      isVerified: () => {
        const { user } = get();
        return user?.is_verified && user?.verification_status === 'approved';
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

export default useAuthStore;

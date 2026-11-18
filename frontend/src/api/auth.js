import apiClient from './client';

/**
 * Register a new user
 */
export const register = async (formData) => {
  const response = await apiClient.post('/register', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

/**
 * Login user
 */
export const login = async (credentials) => {
  const response = await apiClient.post('/login', credentials);
  return response.data;
};

/**
 * Logout user
 */
export const logout = async () => {
  const response = await apiClient.post('/logout');
  return response.data;
};

/**
 * Get current authenticated user
 */
export const getCurrentUser = async () => {
  const response = await apiClient.get('/user');
  return response.data;
};
